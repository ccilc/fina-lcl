import { Response } from "express";
import { AppDataSource } from "../data-source";
import { BankAccount } from "../entities/BankAccount";
import { AccountTransaction } from "../entities/AccountTransaction";
import { AuthenticatedRequest } from "../middleware/auth";

// GET /api/bank-accounts — client : ses comptes ; admin/gérant : tous les comptes
export async function listBankAccounts(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(BankAccount);
  const isStaff = req.user!.role === "admin" || req.user!.role === "advisor";

  const accounts = await repo.find({
    where: isStaff ? {} : { userId: req.user!.id },
    order: { createdAt: "DESC" },
  });

  res.json(accounts);
}

// GET /api/bank-accounts/:id/transactions — historique des mouvements
// (le client ne peut consulter que ses propres comptes)
export async function getAccountTransactions(req: AuthenticatedRequest, res: Response) {
  const accountRepo = AppDataSource.getRepository(BankAccount);
  const txRepo = AppDataSource.getRepository(AccountTransaction);
  const isStaff = req.user!.role === "admin" || req.user!.role === "advisor";

  const account = await accountRepo.findOne({ where: { id: req.params.id } });
  if (!account) return res.status(404).json({ message: "Compte introuvable." });

  if (!isStaff && account.userId !== req.user!.id) {
    return res.status(403).json({ message: "Accès refusé à ce compte." });
  }

  const transactions = await txRepo.find({
    where: { bankAccountId: account.id },
    order: { createdAt: "DESC" },
  });

  res.json({ account, transactions });
}
