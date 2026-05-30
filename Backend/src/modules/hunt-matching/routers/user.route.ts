import { Router } from "express"
import { authMiddleware } from "../../../middlewares/auth.js"
import { upload } from "../../../middlewares/upload.js"
import { uploadAvatarController } from "../controllers/user.controller.js"

const router = Router()

router.patch("/:id/avatar", authMiddleware, upload.single("avatar"), uploadAvatarController)

export default router