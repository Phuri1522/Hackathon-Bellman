import { Router } from "express";
import { getMapMarkers } from "../controllers/map.controller.js"; 

const router = Router();

//When send request (GET) this route will sent it to controller
router.get("/", getMapMarkers);

export default router;