import { prisma } from "../../../db.js"
import { uploadToCloudinary } from "../../../middlewares/upload.js"
import { syncHunterRankScore } from "./huntRequest.service.js"
import type { AutoMatchInput, UpdateHunterInput } from "../schemas/hunter.schema.js"

const getRewardText = (reward: string | null | undefined): string =>
  reward?.trim() ? reward : "-"

export const getHunterById = async (id: number) => {
  await syncHunterRankScore(id)

  const hunter = await prisma.hunter.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  })
  if (!hunter) throw new Error("Hunter not found")
  return hunter
}

export const updateHunterProfile = async (
  id: number,
  data: UpdateHunterInput,
  avatarBuffer?: Buffer
) => {
  let avatarUrl: string | undefined

  if (avatarBuffer) {
    avatarUrl = await uploadToCloudinary(avatarBuffer, "mutant-hunter/avatars")
  }

  const hunter = await prisma.hunter.update({
    where: { id },
    data: {
      ...data,
      ...(avatarUrl && {
        user: {
          update: { avatarUrl },
        },
      }),
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  })

  return hunter
}

export const updateAutoMatch = async (
  id: number,
  data: AutoMatchInput
) => {
  return await prisma.hunter.update({
    where: { id },
    data: {
      autoMatch: data.autoMatch
    },
  })
}

// weekly summary
export const getWeeklySummary = async (hunterId: number) => {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - 7)

  const completed = await prisma.huntRequest.findMany({
    where: {
      hunterId,
      status: "COMPLETED",
      createdAt: { gte: startOfWeek },
    },
    include: {
      post: {
        select: {
          animalType: true,
          mutantType: true,
          reward: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // power weights for quests
  const ANIMAL_WEIGHTS: Record<string, number> = {
    WOLF: 10, BEAR: 10, SHARK: 8, BOAR: 7,
    SNAKE: 7, LIZARD: 6, BIRD: 6,
    CAT: 2, SPIDER: 5, MONKEY: 3,
  }
  const MUTANT_WEIGHTS: Record<string, number> = {
    SHADOW: 5, POISON: 4, ELECTRIC: 3, ICE: 2, FIRE: 3,
  }

  const requests = completed.map((r) => ({
    id: r.id,
    animalType: r.post.animalType,
    mutantType: r.post.mutantType,
    reward: getRewardText(r.post.reward),
    completedAt: r.createdAt,
    powerScore:
      ANIMAL_WEIGHTS[r.post.animalType] * MUTANT_WEIGHTS[r.post.mutantType],
  }))

  const totalPowerScore = requests.reduce((sum, r) => sum + r.powerScore, 0)
  const totalCompleted = requests.length

  const hunter = await prisma.hunter.findUnique({
    where: { id: hunterId },
    select: { rank: true, rankScore: true },
  })

  return {
    week: {
      from: startOfWeek,
      to: now,
    },
    totalCompleted,
    totalPowerScore,
    currentRank: hunter?.rank,
    currentRankScore: hunter?.rankScore,
    requests,
  }
}
