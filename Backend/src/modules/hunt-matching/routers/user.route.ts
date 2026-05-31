import { Router } from "express"
import { upload } from "../../../middlewares/upload.js"
import { updateUserAvatarController } from "../controllers/user.controller.js"

const userRouter = Router()

userRouter.patch("/:id/avatar", upload.single("avatar"), updateUserAvatarController)

export default userRouter
