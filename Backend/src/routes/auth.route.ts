import { Router } from "express"
import { prisma } from "../db.js"
import { registerController, loginController } from "../controllers/auth.controller.js"

const router = Router()

router.post("/register", registerController)
router.post("/login", loginController)

router.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query as { email: string }
    if (!email) return res.status(400).json({ message: "Email is required" })

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    res.json({ available: !existing })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router