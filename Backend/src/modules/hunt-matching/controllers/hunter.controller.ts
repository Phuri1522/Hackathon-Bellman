import { Request, Response } from "express"
import { autoMatchSchema, updateHunterSchema } from "../schemas/hunter.schema.js"
import {
  getHunterById,
  updateHunterProfile,
  getWeeklySummary,
  updateAutoMatch,
} from "../services/hunter.service.js"
import { recommendClass } from "../../../utils/reccommend.js"

export const getHunterController = async (req: Request, res: Response) => {
  try {
    const hunter = await getHunterById(Number(req.params.id))
    res.json(hunter)
  } catch (err: any) {
    res.status(404).json({ message: err.message })
  }
}

export const updateHunterProfileController = async (req: Request, res: Response) => {
  try {
    const requesterId = (req as any).user.hunterId
    if (requesterId !== Number(req.params.id)) {
      return res.status(403).json({ message: "Forbidden" })
    }

    const data = updateHunterSchema.parse(req.body)
    const result = await updateHunterProfile(
      Number(req.params.id),
      data,
      req.file?.buffer
    )
    res.json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const recommendClassController = async (req: Request, res: Response) => {
  try {
    const { animalType } = req.query as { animalType: string }
    if (!animalType) {
      return res.status(400).json({ message: "animalType is required" })
    }
    const result = recommendClass(animalType)
    res.json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const autoMatchController = async (req: Request, res: Response) => {
  try {
    const requesterId = (req as any).user.hunterId
    if (requesterId !== Number(req.params.id)) {
      return res.status(403).json({ message: "Forbidden" })
    }

    const data = autoMatchSchema.parse(req.body)
    const result = await updateAutoMatch(Number(req.params.id), data)
    res.json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const weeklySummaryController = async (req: Request, res: Response) => {
  try {
    const requesterId = (req as any).user.hunterId

    if (requesterId !== Number(req.params.id)) {
      return res.status(403).json({ message: "Forbidden" })
    }

    const summary = await getWeeklySummary(Number(req.params.id))
    res.json(summary)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}