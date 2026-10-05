import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, optionalAuth } from "../middleware/auth";
import {
  simulateLoan,
  quickMonthlyPayment,
  submitPersonalLoan,
  submitProfessionalLoan,
  listPersonalLoans,
  listProfessionalLoans,
} from "../controllers/loanController";

const router = Router();

router.post("/simulate", asyncHandler(simulateLoan));
router.get("/monthly-payment", quickMonthlyPayment);

router.post("/personal", optionalAuth, asyncHandler(submitPersonalLoan));
router.post("/professional", optionalAuth, asyncHandler(submitProfessionalLoan));

router.get("/personal", requireAuth, asyncHandler(listPersonalLoans));
router.get("/professional", requireAuth, asyncHandler(listProfessionalLoans));

export default router;
