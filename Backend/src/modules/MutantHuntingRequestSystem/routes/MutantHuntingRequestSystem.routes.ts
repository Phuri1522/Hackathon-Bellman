import { Router } from "express";
import {
  acceptMutantHuntingRequest,
  createMutantHuntingRequest,
  deleteMutantHuntingRequest,
  getAllMutantHuntingRequests,
  getMutantHuntingRequestById,
} from "../controllers/MutantHuntingRequestSystem.controllers.js";

const router = Router();

router.post("/mutant-hunting-requests", createMutantHuntingRequest);
router.get("/mutant-hunting-requests", getAllMutantHuntingRequests);
router.get("/mutant-hunting-requests/:id", getMutantHuntingRequestById);
router.delete("/mutant-hunting-requests/:id", deleteMutantHuntingRequest);
router.patch(
  "/mutant-hunting-requests/:id/accept",
  acceptMutantHuntingRequest
);

export default router;
