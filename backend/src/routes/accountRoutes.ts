import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, optionalAuth } from "../middleware/auth";
import {
  submitAccountRequest,
  listAccountRequests,
  simulateSavings,
  getInterestRateGrid,
} from "../controllers/accountController";

const router = Router();

router.post("/", optionalAuth, asyncHandler(submitAccountRequest));
router.get("/", requireAuth, asyncHandler(listAccountRequests));
router.get("/interest-rates", getInterestRateGrid);
router.post("/savings-simulation", optionalAuth, asyncHandler(simulateSavings));

export default router;
