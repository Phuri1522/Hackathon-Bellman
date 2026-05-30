import { z } from "zod"

export const applySchema = z.object({
  postId: z.number(),
})

export const updateStatusSchema = z.object({
  status: z.enum([
    "ACCEPTED_BY_USER",
    "DECLINED_BY_USER",
    "DECLINED_BY_HUNTER",
    "COMPLETED",
  ]),
})

export type ApplyInput = z.infer<typeof applySchema>
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>