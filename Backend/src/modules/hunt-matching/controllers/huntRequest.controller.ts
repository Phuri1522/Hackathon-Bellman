import { Request, Response } from "express"
import {
  applyHuntRequest,
  updateHuntRequestStatus,
  autoMatchPost,
  getHuntRequests,
} from "../services/huntRequest.service.js"
import { updateStatusSchema } from "../schemas/huntRequest.schema.js"

export const getHuntRequestsController = async (req: Request, res: Response) => {
  try {
    const postId = req.query.postId ? parseInt(req.query.postId as string) : undefined
    const hunterId = req.query.hunterId ? parseInt(req.query.hunterId as string) : undefined
    const requests = await getHuntRequests(postId, hunterId)
    res.json(requests)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const applyHuntRequestController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const { postId } = req.body
    if (!postId) {
      res.status(400).json({ message: "postId is required" })
      return
    }
    const result = await applyHuntRequest(user.hunterId, parseInt(postId))
    res.status(201).json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const updateHuntRequestStatusController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    const data = updateStatusSchema.parse(req.body)
    const user = (req as any).user
    const result = await updateHuntRequestStatus(id, data, user.id, user.accountType)
    res.json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const triggerAutoMatchController = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body
    if (!postId) {
      res.status(400).json({ message: "postId is required" })
      return
    }
    const result = await autoMatchPost(parseInt(postId))
    res.json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}
