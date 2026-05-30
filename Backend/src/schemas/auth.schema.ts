import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  accountType: z.enum(["USER", "HUNTER"]),
  // Hunter only
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  age: z.number().optional(),
  class: z.enum(["FIGHTER", "TANKER", "RANGER"]).optional(),
}).refine((data) => {
  if (data.accountType === "HUNTER") {
    return data.gender && data.age && data.class
  }
  return true
}, { message: "Hunter requires gender, age, and class" })

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>