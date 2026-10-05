import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  listClients,
  approveClient,
  rejectClient,
  approveAccountRequest,
  rejectAccountRequest,
  approvePersonalLoan,
  rejectPersonalLoan,
  approveProfessionalLoan,
  rejectProfessionalLoan,
} from "../controllers/adminController";
import { approveTransferRequest, rejectTransferRequest } from "../controllers/transferController";

const router = Router();

// Toutes les routes de ce fichier sont réservées à l'administrateur / au gérant
router.use(requireAuth, requireRole("admin", "advisor"));

router.get("/clients", asyncHandler(listClients));
router.patch("/clients/:id/approve", asyncHandler(approveClient));
router.patch("/clients/:id/reject", asyncHandler(rejectClient));

router.patch("/account-requests/:id/approve", asyncHandler(approveAccountRequest));
router.patch("/account-requests/:id/reject", asyncHandler(rejectAccountRequest));

router.patch("/personal-loans/:id/approve", asyncHandler(approvePersonalLoan));
router.patch("/personal-loans/:id/reject", asyncHandler(rejectPersonalLoan));
router.patch("/professional-loans/:id/approve", asyncHandler(approveProfessionalLoan));
router.patch("/professional-loans/:id/reject", asyncHandler(rejectProfessionalLoan));

router.patch("/transfers/:id/approve", asyncHandler(approveTransferRequest));
router.patch("/transfers/:id/reject", asyncHandler(rejectTransferRequest));

export default router;
