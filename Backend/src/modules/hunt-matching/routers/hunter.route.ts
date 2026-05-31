import { Router } from "express"
import { upload } from "../../../middlewares/upload.js"
import {
  getHunterByIdController,
  updateHunterController,
  toggleAutoMatchController,
  getWeeklySummaryController,
  recommendClassController,
} from "../controllers/hunter.controller.js"

const hunterRouter = Router()

hunterRouter.get("/recommend-class", recommendClassController)
hunterRouter.get("/:id", getHunterByIdController)
hunterRouter.patch("/:id", upload.single("avatar"), updateHunterController)
hunterRouter.get("/:id/summary/weekly", getWeeklySummaryController)
hunterRouter.patch("/:id/auto-match", toggleAutoMatchController)

export default hunterRouter
