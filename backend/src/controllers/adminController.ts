import { Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { AccountRequest } from "../entities/AccountRequest";
import { BankAccount } from "../entities/BankAccount";
import { PersonalLoanApplication } from "../entities/PersonalLoanApplication";
import { ProfessionalLoanApplication } from "../entities/ProfessionalLoanApplication";
import { AccountTransaction } from "../entities/AccountTransaction";
import { AuthenticatedRequest } from "../middleware/auth";
import { generateAccountNumber } from "../utils/accountNumber";

// ---------- Gestion des comptes clients ----------

// GET /api/admin/clients?status=en_attente
export async function listClients(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(User);
  const status = req.query.status as string | undefined;
  const where: any = { role: "client" };
  if (status) where.status = status;
  const clients = await repo.find({ where, order: { createdAt: "DESC" } });
  res.json(
    clients.map((c) => ({
      id: c.id,
      email: c.email,
      fullName: c.fullName,
      phone: c.phone,
      status: c.status,
      createdAt: c.createdAt,
    }))
  );
}

// PATCH /api/admin/clients/:id/approve
export async function approveClient(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(User);
  const client = await repo.findOne({ where: { id: req.params.id, role: "client" } });
  if (!client) return res.status(404).json({ message: "Client introuvable." });

  client.status = "actif";
  await repo.save(client);
  res.json({ message: "Le compte client a été validé.", id: client.id });
}

// PATCH /api/admin/clients/:id/reject
export async function rejectClient(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(User);
  const client = await repo.findOne({ where: { id: req.params.id, role: "client" } });
  if (!client) return res.status(404).json({ message: "Client introuvable." });

  client.status = "rejete";
  await repo.save(client);
  res.json({ message: "Le compte client a été refusé.", id: client.id });
}

// ---------- Validation des demandes d'ouverture de compte ----------

// PATCH /api/admin/account-requests/:id/approve
export async function approveAccountRequest(req: AuthenticatedRequest, res: Response) {
  const requestRepo = AppDataSource.getRepository(AccountRequest);
  const accountRepo = AppDataSource.getRepository(BankAccount);

  const request = await requestRepo.findOne({ where: { id: req.params.id } });
  if (!request) return res.status(404).json({ message: "Demande introuvable." });

  request.status = "approuve";
  await requestRepo.save(request);

  if (!request.userId) {
    return res.json({
      message:
        "Demande approuvée. Aucun compte client associé : la personne doit d'abord créer un compte sur le site pour qu'un compte bancaire interne lui soit ouvert.",
      bankAccount: null,
    });
  }

  const bankAccount = accountRepo.create({
    userId: request.userId,
    accountNumber: generateAccountNumber(),
    productType: request.productType,
    balance: 0,
    interestRate: request.proposedInterestRate ?? 0,
    lockDurationMonths: request.lockDurationMonths,
    lockEndDate:
      request.productType === "epargne_bloquee" && request.lockDurationMonths
        ? addMonthsToToday(request.lockDurationMonths)
        : undefined,
    status: "actif",
  });
  const saved = await accountRepo.save(bankAccount);

  res.json({
    message: "Demande approuvée et compte bancaire ouvert avec succès.",
    bankAccount: saved,
  });
}

// PATCH /api/admin/account-requests/:id/reject
export async function rejectAccountRequest(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(AccountRequest);
  const request = await repo.findOne({ where: { id: req.params.id } });
  if (!request) return res.status(404).json({ message: "Demande introuvable." });

  request.status = "refuse";
  await repo.save(request);
  res.json({ message: "Demande refusée.", id: request.id });
}

// ---------- Validation des prêts (avec crédit automatique du compte) ----------

async function creditLoanToAccount(userId: string | null | undefined, amount: number, description: string) {
  if (!userId) return null;

  const accountRepo = AppDataSource.getRepository(BankAccount);
  const txRepo = AppDataSource.getRepository(AccountTransaction);

  // On crédite le compte courant actif du client (le plus adapté pour recevoir un prêt)
  const account = await accountRepo.findOne({
    where: { userId, status: "actif", productType: "courant" },
    order: { createdAt: "ASC" },
  });

  if (!account) return null;

  account.balance = Number(account.balance) + amount;
  await accountRepo.save(account);

  await txRepo.save(
    txRepo.create({
      bankAccountId: account.id,
      type: "credit_pret",
      amount,
      description,
      balanceAfter: account.balance,
    })
  );

  return account;
}

// PATCH /api/admin/personal-loans/:id/approve
export async function approvePersonalLoan(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(PersonalLoanApplication);
  const loan = await repo.findOne({ where: { id: req.params.id } });
  if (!loan) return res.status(404).json({ message: "Demande introuvable." });

  loan.status = "approuve";
  await repo.save(loan);

  const account = await creditLoanToAccount(
    loan.userId,
    Number(loan.loanAmount),
    `Crédit du prêt personnel approuvé (${loan.id})`
  );

  res.json({
    message: account
      ? "Prêt approuvé et crédité sur le compte courant du client."
      : "Prêt approuvé. Le client n'a pas encore de compte courant actif chez FINA LCL : les fonds ne peuvent pas être crédités automatiquement pour le moment.",
    creditedAccount: account,
  });
}

// PATCH /api/admin/personal-loans/:id/reject
export async function rejectPersonalLoan(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(PersonalLoanApplication);
  const loan = await repo.findOne({ where: { id: req.params.id } });
  if (!loan) return res.status(404).json({ message: "Demande introuvable." });
  loan.status = "refuse";
  await repo.save(loan);
  res.json({ message: "Demande de prêt refusée.", id: loan.id });
}

// PATCH /api/admin/professional-loans/:id/approve
export async function approveProfessionalLoan(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(ProfessionalLoanApplication);
  const loan = await repo.findOne({ where: { id: req.params.id } });
  if (!loan) return res.status(404).json({ message: "Demande introuvable." });

  loan.status = "approuve";
  await repo.save(loan);

  const account = await creditLoanToAccount(
    loan.userId,
    Number(loan.loanAmount),
    `Crédit du prêt professionnel approuvé (${loan.id})`
  );

  res.json({
    message: account
      ? "Prêt approuvé et crédité sur le compte courant du client."
      : "Prêt approuvé. Le client n'a pas encore de compte courant actif chez FINA LCL : les fonds ne peuvent pas être crédités automatiquement pour le moment.",
    creditedAccount: account,
  });
}

// PATCH /api/admin/professional-loans/:id/reject
export async function rejectProfessionalLoan(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(ProfessionalLoanApplication);
  const loan = await repo.findOne({ where: { id: req.params.id } });
  if (!loan) return res.status(404).json({ message: "Demande introuvable." });
  loan.status = "refuse";
  await repo.save(loan);
  res.json({ message: "Demande de prêt refusée.", id: loan.id });
}

function addMonthsToToday(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}
