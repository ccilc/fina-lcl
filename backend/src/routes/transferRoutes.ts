import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth } from "../middleware/auth";
import { createTransferRequest, listTransferRequests } from "../controllers/transferController";

const router = Router();

router.post("/", requireAuth, asyncHandler(createTransferRequest));
router.get("/", requireAuth, asyncHandler(listTransferRequests));

export default router;
