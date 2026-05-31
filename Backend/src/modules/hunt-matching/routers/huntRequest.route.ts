import { Router } from "express"
import {
  getHuntRequestsController,
  applyHuntRequestController,
  updateHuntRequestStatusController,
  triggerAutoMatchController,
} from "../controllers/huntRequest.controller.js"

const huntRequestRouter = Router()

huntRequestRouter.get("/", getHuntRequestsController)
huntRequestRouter.post("/", applyHuntRequestController)
huntRequestRouter.post("/auto-match", triggerAutoMatchController)
huntRequestRouter.patch("/:id", updateHuntRequestStatusController)

export default huntRequestRouter
