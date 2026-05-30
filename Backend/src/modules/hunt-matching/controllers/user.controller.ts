import { Request, Response } from "express"
import { prisma } from "../../../db.js"
import { uploadToCloudinary } from "../../../middlewares/upload.js"

export const uploadAvatarController = async (req: Request, res: Response) => {
  try {
    const requesterId = (req as any).user.id

    if (requesterId !== Number(req.params.id)) {
      return res.status(403).json({ message: "Forbidden" })
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const avatarUrl = await uploadToCloudinary(
      req.file.buffer,
      "mutant-hunter/avatars"
    )

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { avatarUrl },
    })

    res.json({ avatarUrl: user.avatarUrl })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}