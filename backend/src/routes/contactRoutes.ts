import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, optionalAuth } from "../middleware/auth";
import { submitContactMessage, listContactMessages } from "../controllers/contactController";

const router = Router();

router.post("/", optionalAuth, asyncHandler(submitContactMessage));
router.get("/", requireAuth, asyncHandler(listContactMessages));

export default router;
