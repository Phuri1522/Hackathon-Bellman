import { Request, Response } from "express"
import { applySchema, updateStatusSchema } from "../schemas/huntRequest.schema.js"
import {
  applyHuntRequest,
  updateHuntRequestStatus,
  getHuntRequests,
  autoMatchPost,
} from "../services/huntRequest.service.js"

export const applyController = async (req: Request, res: Response) => {
  try {
    const { postId } = applySchema.parse(req.body)
    const hunterId = (req as any).user.hunterId
    if (!hunterId) return res.status(403).json({ message: "Hunters only" })

    const result = await applyHuntRequest(hunterId, postId)
    res.status(201).json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const updateStatusController = async (req: Request, res: Response) => {
  try {
    const data = updateStatusSchema.parse(req.body)
    const requesterId = (req as any).user.id
    const requesterType = (req as any).user.accountType

    const result = await updateHuntRequestStatus(
      Number(req.params.id),
      data,
      requesterId,
      requesterType
    )
    res.json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const getHuntRequestsController = async (req: Request, res: Response) => {
  try {
    const { postId, hunterId } = req.query as {
      postId?: string
      hunterId?: string
    }

    const result = await getHuntRequests(
      postId ? Number(postId) : undefined,
      hunterId ? Number(hunterId) : undefined
    )
    res.json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const autoMatchController = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body
    if (!postId) return res.status(400).json({ message: "postId is required" })

    const result = await autoMatchPost(Number(postId))
    res.json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}