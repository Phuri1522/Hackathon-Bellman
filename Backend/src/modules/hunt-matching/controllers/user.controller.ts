import { Request, Response } from "express"
import { prisma } from "../../../db.js"
import { uploadToCloudinary } from "../../../middlewares/upload.js"

export const updateUserAvatarController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    const buffer = (req as any).file?.buffer
    if (!buffer) {
      res.status(400).json({ message: "No file uploaded" })
      return
    }
    const avatarUrl = await uploadToCloudinary(buffer, "mutant-hunter/avatars")
    const user = await prisma.user.update({
      where: { id },
      data: { avatarUrl },
      select: { id: true, name: true, email: true, avatarUrl: true },
    })
    res.json(user)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}
