import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../db.js"
import type { RegisterInput } from "../schemas/auth.schema.js"

export const register = async (data: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  })
  if (existing) throw new Error("Email already in use")

  const hashed = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashed,
      accountType: data.accountType,
    },
  })

  // create hunter
  if (data.accountType === "HUNTER") {
    const hunter = await prisma.hunter.create({
      data: {
        userId: user.id,
        gender: data.gender!,
        age: data.age!,
        class: data.class!,
      },
    })

    const token = jwt.sign(
      { id: user.id, hunterId: hunter.id, accountType: user.accountType },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        accountType: user.accountType,
        hunter: {
          id: hunter.id,
          gender: hunter.gender,
          age: hunter.age,
          class: hunter.class,
          rank: hunter.rank,
          rankScore: hunter.rankScore,
        },
      },
    }
  }

  // USER
  const token = jwt.sign(
    { id: user.id, accountType: user.accountType },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  )

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      accountType: user.accountType,
      hunter: null,
    },
  }
}

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
        include: {
            hunter: {
                select: {
                    id: true,
                    gender: true,
                    age: true,
                    class: true,
                    rank: true,
                    rankScore: true,
                    autoMatch: true,
                }
            }
        },
    })
  if (!user) throw new Error("Invalid email or password")

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new Error("Invalid email or password")

  const token = jwt.sign(
    { 
      id: user.id, 
      hunterId: user.hunter?.id ?? null,
      accountType: user.accountType 
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  )

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      accountType: user.accountType,
      hunter: user.hunter ? {
        id: user.hunter.id,
        gender: user.hunter.gender,
        age: user.hunter.age,
        class: user.hunter.class,
        rank: user.hunter.rank,
        rankScore: user.hunter.rankScore,
      } : null,
    },
  }
}