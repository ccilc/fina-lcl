import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, optionalAuth } from "../middleware/auth";
import {
  submitInvestmentAccount,
  listInvestmentAccounts,
  registerWebinar,
  listWebinarRegistrations,
} from "../controllers/investmentController";

const router = Router();

router.post("/accounts", optionalAuth, asyncHandler(submitInvestmentAccount));
router.get("/accounts", requireAuth, asyncHandler(listInvestmentAccounts));

router.post("/webinars", optionalAuth, asyncHandler(registerWebinar));
router.get("/webinars", requireAuth, asyncHandler(listWebinarRegistrations));

export default router;
