import { prisma } from "../../../db.js"
import { calculateDistance } from "../../../utils/distance.js"
import { recommendClass } from "../../../utils/reccommend.js"
import type { UpdateStatusInput } from "../schemas/huntRequest.schema.js"

const ANIMAL_WEIGHTS: Record<string, number> = {
    WOLF: 10, BEAR: 10, SHARK: 8, BOAR: 7,
    SNAKE: 7, LIZARD: 6, BIRD: 6,
    CAT: 2, SPIDER: 5, MONKEY: 3,
}
const MUTANT_WEIGHTS: Record<string, number> = {
    SHADOW: 5, POISON: 4, ELECTRIC: 3, ICE: 2, FIRE: 3,
}

const RANK_THRESHOLDS: Record<string, number> = {
  S: 1000, A: 700, B: 400, C: 200, D: 0,
}

const calculateRank = (score: number): string => {
  if (score >= 1000) return "S"
  if (score >= 700) return "A"
  if (score >= 400) return "B"
  if (score >= 200) return "C"
  return "D"
}

// Hunter apply
export const applyHuntRequest = async (hunterId: number, postId: number) => {
  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) throw new Error("Post not found")
  if (!["OPEN", "MATCHMAKING", "PUBLIC"].includes(post.status)) throw new Error("Post is no longer open")

  const hunter = await prisma.hunter.findUnique({ where: { id: hunterId } })
  if (!hunter) throw new Error("Hunter not found")

  // check class (S can skip this step)
  if (hunter.rank !== "S") {
    const { requiredClasses } = recommendClass(post.animalType.toUpperCase())
    if (!requiredClasses.includes(hunter.class as any)) {
      throw new Error(
        `Your class (${hunter.class}) cannot handle this. Required: ${requiredClasses.join(", ")}`
      )
    }
  }

  // check if hunter already has an active job
  const activeJob = await prisma.huntRequest.findFirst({
    where: { hunterId, status: { in: ["PENDING", "ACCEPTED_BY_USER"] } },
  })
  if (activeJob) throw new Error("You already have an active job. Complete it first.")

  // check if already applied to this specific post
  const existing = await prisma.huntRequest.findFirst({
    where: { hunterId, postId },
  })
  if (existing) throw new Error("Already applied to this post")

  const request = await prisma.huntRequest.create({
    data: { postId, hunterId, status: "ACCEPTED_BY_USER" },
  })
  await Promise.all([
    prisma.post.update({ where: { id: postId }, data: { status: "MATCHED" } }),
    prisma.hunter.update({ where: { id: hunterId }, data: { autoMatch: false } }),
  ])
  return request
}

// Update status (accepted/declined/complete)
export const updateHuntRequestStatus = async (
  id: number,
  data: UpdateStatusInput,
  requesterId: number,
  requesterType: string
) => {
  const huntRequest = await prisma.huntRequest.findUnique({
    where: { id },
    include: { post: true, hunter: true },
  })
  if (!huntRequest) throw new Error("Hunt request not found")

  // check ownership
  if (
    data.status === "ACCEPTED_BY_USER" ||
    data.status === "DECLINED_BY_USER"
  ) {
    const isHunterAcceptingAutoMatch =
      huntRequest.isAutoMatched &&
      data.status === "ACCEPTED_BY_USER" &&
      requesterType === "HUNTER" &&
      huntRequest.hunter.userId === requesterId

    if (!isHunterAcceptingAutoMatch) {
      if (requesterType !== "USER" || huntRequest.post.userId !== requesterId) {
        throw new Error("Only post owner can accept or decline")
      }
    }
  }

  if (data.status === "DECLINED_BY_HUNTER") {
    if (requesterType !== "HUNTER" || huntRequest.hunter.userId !== requesterId) {
      throw new Error("Only the hunter can decline")
    }
  }

  // update status
  const updated = await prisma.huntRequest.update({
    where: { id },
    data: { status: data.status },
  })

  // if complete calc rank
  if (data.status === "COMPLETED") {
    const powerScore =
      ANIMAL_WEIGHTS[huntRequest.post.animalType] *
      MUTANT_WEIGHTS[huntRequest.post.mutantType]

    const hunter = await prisma.hunter.findUnique({
      where: { id: huntRequest.hunterId },
    })

    const newScore = (hunter?.rankScore ?? 0) + powerScore
    const newRank = calculateRank(newScore)

    await prisma.hunter.update({
      where: { id: huntRequest.hunterId },
      data: { rankScore: newScore, rank: newRank, autoMatch: true },
    })

    // update post status
    await prisma.post.update({
      where: { id: huntRequest.postId },
      data: { status: "COMPLETED" },
    })
  }

  // if accepted: update post to MATCHED + disable hunter autoMatch
  if (data.status === "ACCEPTED_BY_USER") {
    await prisma.post.update({
      where: { id: huntRequest.postId },
      data: { status: "MATCHED" },
    })
    await prisma.hunter.update({
      where: { id: huntRequest.hunterId },
      data: { autoMatch: false },
    })
  }

  return updated
}

export const autoMatchPost = async (postId: number) => {
  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) throw new Error("Post not found")
  if (!["OPEN", "MATCHMAKING", "PUBLIC"].includes(post.status)) throw new Error("Post is not open")

  const ANIMAL_WEIGHTS: Record<string, number> = {
    WOLF: 10, BEAR: 10, SHARK: 8, BOAR: 7,
    SNAKE: 7, LIZARD: 6, BIRD: 6,
    CAT: 2, SPIDER: 5, MONKEY: 3,
  }
  const MUTANT_WEIGHTS: Record<string, number> = {
    SHADOW: 5, POISON: 4, ELECTRIC: 3, ICE: 2, FIRE: 3,
  }
  const RANK_SCORE: Record<string, number> = {
    S: 500, A: 300, B: 200, C: 100, D: 0,
  }

  const postPower = ANIMAL_WEIGHTS[post.animalType.toUpperCase()] * MUTANT_WEIGHTS[post.mutantType.toUpperCase()]
  const { requiredClasses, recommendedClass } = recommendClass(post.animalType.toUpperCase())

  const hunters = await prisma.hunter.findMany({
    where: { autoMatch: true },
  })

  let bestHunter: (typeof hunters)[0] | null = null
  let bestScore = -1

  for (const hunter of hunters) {

    if (hunter.rank !== "S") {
      if (!requiredClasses.includes(hunter.class as any)) continue
    }

    // skip hunters who already have an active job
    const hasActiveJob = await prisma.huntRequest.findFirst({
      where: { hunterId: hunter.id, status: { in: ["PENDING", "ACCEPTED_BY_USER"] } },
    })
    if (hasActiveJob) continue

    const existing = await prisma.huntRequest.findFirst({
      where: { hunterId: hunter.id, postId },
    })
    if (existing) continue

    const rankBonus = RANK_SCORE[hunter.rank] ?? 0
    const classBonus = hunter.class === recommendedClass ? 50 : 0
    const powerBonus = Math.min(hunter.rankScore, postPower * 10)
    const totalScore = rankBonus + classBonus + powerBonus

    if (totalScore > bestScore) {
      bestScore = totalScore
      bestHunter = hunter
    }
  }

  if (!bestHunter) return { message: "No matching hunter found" }

  const huntRequest = await prisma.huntRequest.create({
    data: {
      postId,
      hunterId: bestHunter.id,
      status: "PENDING",
      isAutoMatched: true,
    },
  })

  return {
    message: "Auto matched successfully",
    huntRequest,
    matchedHunter: {
      id: bestHunter.id,
      rank: bestHunter.rank,
      class: bestHunter.class,
      score: bestScore,
    },
  }
}
// request list
export const getHuntRequests = async (
  postId?: number,
  hunterId?: number
) => {
  return await prisma.huntRequest.findMany({
    where: {
      ...(postId && { postId }),
      ...(hunterId && { hunterId }),
    },
    include: {
      hunter: {
        include: {
          user: { select: { name: true } },
        },
      },
      post: true,
    },
    orderBy: { createdAt: "desc" },
  })
}