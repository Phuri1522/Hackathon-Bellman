import { Router } from "express";
import {
  acceptMutantHuntingRequest,
  completeMutantHuntingRequest,
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
router.patch(
  "/mutant-hunting-requests/:id/complete",
  completeMutantHuntingRequest
);

export default router;
