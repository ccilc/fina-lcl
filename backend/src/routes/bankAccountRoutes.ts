import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";
import { listBankAccounts, getAccountTransactions } from "../controllers/bankAccountController";

const router = Router();

router.get("/", requireAuth, asyncHandler(listBankAccounts));
router.get("/:id/transactions", requireAuth, asyncHandler(getAccountTransactions));

export default router;
