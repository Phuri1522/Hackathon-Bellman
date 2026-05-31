import { z } from "zod"

export const updateStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "ACCEPTED_BY_USER",
    "DECLINED_BY_USER",
    "DECLINED_BY_HUNTER",
    "AUTO_ACCEPTED",
    "COMPLETED",
  ]),
})

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
