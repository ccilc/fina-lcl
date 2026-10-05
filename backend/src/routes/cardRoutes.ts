import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, optionalAuth } from "../middleware/auth";
import { submitCardRequest, listCardRequests } from "../controllers/cardController";

const router = Router();

router.post("/", optionalAuth, asyncHandler(submitCardRequest));
router.get("/", requireAuth, asyncHandler(listCardRequests));

export default router;
