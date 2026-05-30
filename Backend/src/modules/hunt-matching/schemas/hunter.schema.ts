import { z } from "zod"

export const updateHunterSchema = z.object({
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  age: z.coerce.number().optional(),
  class: z.enum(["FIGHTER", "TANKER", "RANGER"]).optional(),
})

export const autoMatchSchema = z.object({
  autoMatch: z.boolean()
})

export type UpdateHunterInput = z.infer<typeof updateHunterSchema>
export type AutoMatchInput = z.infer<typeof autoMatchSchema>
