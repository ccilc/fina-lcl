import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { AccountRequest } from "../entities/AccountRequest";
import { SavingsSimulation } from "../entities/SavingsSimulation";
import {
  computeSavingsPlan,
  estimateBlockedSavingsRate,
  FREE_SAVINGS_RATE,
} from "../utils/loanCalculator";
import { AuthenticatedRequest } from "../middleware/auth";

export async function submitAccountRequest(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(AccountRequest);

  const body = { ...req.body };

  // Calcule automatiquement un taux indicatif selon le produit choisi
  if (body.productType === "epargne_bloquee" && body.lockDurationMonths) {
    body.proposedInterestRate = estimateBlockedSavingsRate(body.lockDurationMonths);
  } else if (body.productType === "epargne_libre") {
    body.proposedInterestRate = FREE_SAVINGS_RATE;
  }

  // Si l'utilisateur est connecté, la demande est automatiquement rattachée à son compte
  if (req.user) {
    body.userId = req.user.id;
  }

  const entity = repo.create(body);
  const saved = await repo.save(entity);
  res.status(201).json({
    message:
      "Votre demande d'ouverture de compte a bien été envoyée. Votre contrat vous sera transmis par email sous 48h.",
    id: (saved as any).id,
    proposedInterestRate: body.proposedInterestRate ?? null,
  });
}

// GET /api/accounts — admin/gérant : toutes les demandes ; client : uniquement les siennes
export async function listAccountRequests(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(AccountRequest);
  const isStaff = req.user?.role === "admin" || req.user?.role === "advisor";
  const items = await repo.find({
    where: isStaff ? {} : { userId: req.user!.id },
    order: { createdAt: "DESC" },
  });
  res.json(items);
}

// GET /api/accounts/interest-rates — grille de taux publique (épargne bloquée / libre)
export function getInterestRateGrid(req: Request, res: Response) {
  res.json({
    freeSavingsRate: FREE_SAVINGS_RATE,
    blockedSavingsTiers: [
      { minMonths: 0, maxMonths: 5, rate: estimateBlockedSavingsRate(0) },
      { minMonths: 6, maxMonths: 11, rate: estimateBlockedSavingsRate(6) },
      { minMonths: 12, maxMonths: 23, rate: estimateBlockedSavingsRate(12) },
      { minMonths: 24, maxMonths: 35, rate: estimateBlockedSavingsRate(24) },
      { minMonths: 36, maxMonths: 59, rate: estimateBlockedSavingsRate(36) },
      { minMonths: 60, maxMonths: null, rate: estimateBlockedSavingsRate(60) },
    ],
  });
}

// POST /api/accounts/savings-simulation
export async function simulateSavings(req: AuthenticatedRequest, res: Response) {
  const { monthlyAmount, durationMonths, interestRate, email, productType, lockDurationMonths } =
    req.body as {
      monthlyAmount: number;
      durationMonths: number;
      interestRate?: number;
      email?: string;
      productType?: "epargne_libre" | "epargne_bloquee";
      lockDurationMonths?: number;
    };

  if (!monthlyAmount || !durationMonths) {
    return res.status(400).json({
      message: "Les champs monthlyAmount et durationMonths sont obligatoires.",
    });
  }

  let rate = interestRate;
  if (rate === undefined) {
    if (productType === "epargne_bloquee") {
      rate = estimateBlockedSavingsRate(lockDurationMonths ?? durationMonths);
    } else {
      rate = FREE_SAVINGS_RATE;
    }
  }

  const result = computeSavingsPlan(monthlyAmount, durationMonths, rate);

  const repo = AppDataSource.getRepository(SavingsSimulation);
  const saved = await repo.save(
    repo.create({
      monthlyAmount,
      durationMonths,
      interestRate: rate,
      finalCapital: result.finalCapital,
      totalInterest: result.totalInterest,
      email,
    })
  );

  res.json({
    id: (saved as any).id,
    interestRate: rate,
    totalDeposited: result.totalDeposited,
    totalInterest: result.totalInterest,
    finalCapital: result.finalCapital,
  });
}
