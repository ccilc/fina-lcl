import { Response } from "express";
import { AppDataSource } from "../data-source";
import { TransferRequest } from "../entities/TransferRequest";
import { BankAccount } from "../entities/BankAccount";
import { AccountTransaction } from "../entities/AccountTransaction";
import { AuthenticatedRequest } from "../middleware/auth";

// POST /api/transfers — le client demande un virement de son compte interne
// vers sa propre banque. Le solde n'est pas débité immédiatement : la demande
// passe par une validation manuelle (contrôle de conformité standard), comme
// pour tout virement bancaire réel. Aucun pourcentage n'est bloqué : le solde
// affiché au client reste exact et consultable à tout moment.
export async function createTransferRequest(req: AuthenticatedRequest, res: Response) {
  const { bankAccountId, amount, beneficiaryBankName, beneficiaryIban } = req.body as {
    bankAccountId: string;
    amount: number;
    beneficiaryBankName: string;
    beneficiaryIban: string;
  };

  if (!bankAccountId || !amount || !beneficiaryBankName || !beneficiaryIban) {
    return res.status(400).json({ message: "Tous les champs du virement sont obligatoires." });
  }

  const accountRepo = AppDataSource.getRepository(BankAccount);
  const account = await accountRepo.findOne({ where: { id: bankAccountId } });

  if (!account || account.userId !== req.user!.id) {
    return res.status(403).json({ message: "Ce compte ne vous appartient pas." });
  }

  if (Number(amount) > Number(account.balance)) {
    return res.status(400).json({
      message: "Le montant demandé dépasse le solde disponible sur votre compte.",
    });
  }

  const repo = AppDataSource.getRepository(TransferRequest);
  const transfer = repo.create({
    bankAccountId: account.id,
    userId: req.user!.id,
    amount,
    beneficiaryBankName,
    beneficiaryIban,
    status: "en_attente",
  });
  const saved = await repo.save(transfer);

  res.status(201).json({
    message:
      "Votre demande de virement a été enregistrée. Elle sera traitée par notre service conformité sous 24 à 48h ouvrées.",
    id: saved.id,
  });
}

// GET /api/transfers — client : ses virements ; admin/gérant : tous
export async function listTransferRequests(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(TransferRequest);
  const isStaff = req.user!.role === "admin" || req.user!.role === "advisor";

  const transfers = await repo.find({
    where: isStaff ? {} : { userId: req.user!.id },
    order: { createdAt: "DESC" },
  });

  res.json(transfers);
}

// PATCH /api/admin/transfers/:id/approve — exécute le virement (débit réel du compte)
export async function approveTransferRequest(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(TransferRequest);
  const accountRepo = AppDataSource.getRepository(BankAccount);
  const txRepo = AppDataSource.getRepository(AccountTransaction);

  const transfer = await repo.findOne({ where: { id: req.params.id } });
  if (!transfer) return res.status(404).json({ message: "Virement introuvable." });
  if (transfer.status !== "en_attente") {
    return res.status(400).json({ message: "Ce virement a déjà été traité." });
  }

  const account = await accountRepo.findOne({ where: { id: transfer.bankAccountId } });
  if (!account) return res.status(404).json({ message: "Compte introuvable." });

  if (Number(transfer.amount) > Number(account.balance)) {
    return res.status(400).json({ message: "Solde insuffisant pour exécuter ce virement." });
  }

  account.balance = Number(account.balance) - Number(transfer.amount);
  await accountRepo.save(account);

  await txRepo.save(
    txRepo.create({
      bankAccountId: account.id,
      type: "virement_sortant",
      amount: -Number(transfer.amount),
      description: `Virement vers ${transfer.beneficiaryBankName} (${transfer.beneficiaryIban})`,
      balanceAfter: account.balance,
    })
  );

  transfer.status = "validee";
  transfer.reviewNote = (req.body?.reviewNote as string) || undefined;
  await repo.save(transfer);

  res.json({ message: "Virement validé et exécuté.", id: transfer.id });
}

// PATCH /api/admin/transfers/:id/reject
export async function rejectTransferRequest(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(TransferRequest);
  const transfer = await repo.findOne({ where: { id: req.params.id } });
  if (!transfer) return res.status(404).json({ message: "Virement introuvable." });

  transfer.status = "rejetee";
  transfer.reviewNote = (req.body?.reviewNote as string) || undefined;
  await repo.save(transfer);

  res.json({ message: "Virement refusé.", id: transfer.id });
}
