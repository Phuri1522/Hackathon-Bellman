import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

// POST 
router.post("/register", register);

// POST 
router.post("/login", login);

export default router;