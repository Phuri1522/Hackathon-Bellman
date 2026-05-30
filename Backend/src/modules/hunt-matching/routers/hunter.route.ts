import { Router } from "express"
import { upload } from "../../../middlewares/upload.js"
import { authMiddleware } from "../../../middlewares/auth.js"
import {
  autoMatchController,
  getHunterController,
  updateHunterProfileController,
  weeklySummaryController,
  recommendClassController,  // ← เพิ่ม import
} from "../controllers/hunter.controller.js"

const router = Router()

router.get("/recommend-class", authMiddleware, recommendClassController)

router.get("/:id", authMiddleware, getHunterController)
router.patch("/:id", authMiddleware, upload.single("avatar"), updateHunterProfileController)
router.get("/:id/summary/weekly", authMiddleware, weeklySummaryController)
router.patch("/:id/auto-match", authMiddleware, autoMatchController)

export default router