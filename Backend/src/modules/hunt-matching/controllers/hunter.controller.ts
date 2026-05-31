import { Request, Response } from "express"
import {
  getHunterById,
  updateHunterProfile,
  updateAutoMatch,
  getWeeklySummary,
} from "../services/hunter.service.js"
import { recommendClass } from "../../../utils/reccommend.js"
import { updateHunterSchema, autoMatchSchema } from "../schemas/hunter.schema.js"

export const getHunterByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    const hunter = await getHunterById(id)
    res.json(hunter)
  } catch (err: any) {
    res.status(404).json({ message: err.message })
  }
}

export const updateHunterController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    const data = updateHunterSchema.parse(req.body)
    const avatarBuffer = (req as any).file?.buffer
    const hunter = await updateHunterProfile(id, data, avatarBuffer)
    res.json(hunter)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const toggleAutoMatchController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    const data = autoMatchSchema.parse(req.body)
    const hunter = await updateAutoMatch(id, data)
    res.json(hunter)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const getWeeklySummaryController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    const summary = await getWeeklySummary(id)
    res.json(summary)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const recommendClassController = async (req: Request, res: Response) => {
  try {
    const { animalType } = req.query as { animalType: string }
    if (!animalType) {
      res.status(400).json({ message: "animalType is required" })
      return
    }
    const result = recommendClass(animalType)
    res.json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}
