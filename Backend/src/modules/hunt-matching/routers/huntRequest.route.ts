import { Router } from "express"
import { authMiddleware } from "../../../middlewares/auth.js"
import {
  applyController,
  updateStatusController,
  getHuntRequestsController,
  autoMatchController,
} from "../controllers/huntRequest.controller.js"

const router = Router()


router.post("/auto-match", autoMatchController)

router.post("/", authMiddleware, applyController)
router.patch("/:id", authMiddleware, updateStatusController)
router.get("/", authMiddleware, getHuntRequestsController)

export default router