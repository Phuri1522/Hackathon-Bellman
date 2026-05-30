import { Request, Response } from "express"
import { registerSchema, loginSchema } from "../schemas/auth.schema.js"
import { register, login } from "../services/auth.service.js"

export const registerController = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body)
    const result = await register(data)
    res.status(201).json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const result = await login(email, password)
    res.json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}