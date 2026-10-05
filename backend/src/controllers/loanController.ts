import { Response } from "express";
import { AppDataSource } from "../data-source";
import { PersonalLoanApplication } from "../entities/PersonalLoanApplication";
import { ProfessionalLoanApplication } from "../entities/ProfessionalLoanApplication";
import {
  buildAmortizationSchedule,
  computeMonthlyPayment,
  estimateIndicativeRate,
} from "../utils/loanCalculator";
import { AuthenticatedRequest } from "../middleware/auth";

const MAX_LOAN_DURATION_MONTHS = 240;

// POST /api/loans/simulate
export async function simulateLoan(req: AuthenticatedRequest, res: Response) {
  const { amount, durationMonths, loanType, interestRate, monthlyIncome } = req.body as {
    amount: number;
    durationMonths: number;
    loanType: "personnel" | "professionnel";
    interestRate?: number;
    monthlyIncome?: number;
  };

  if (!amount || !durationMonths || !loanType) {
    return res.status(400).json({
      message: "Les champs amount, durationMonths et loanType sont obligatoires.",
    });
  }

  if (durationMonths > MAX_LOAN_DURATION_MONTHS) {
    return res.status(400).json({
      message: `La durée du prêt ne peut pas dépasser ${MAX_LOAN_DURATION_MONTHS} mois.`,
    });
  }

  const rate = interestRate ?? estimateIndicativeRate(loanType);
  const result = buildAmortizationSchedule(amount, rate, durationMonths);

  const debtRatio = monthlyIncome
    ? Math.round((result.monthlyPayment / monthlyIncome) * 1000) / 10
    : null;

  res.json({
    input: { amount, durationMonths, loanType, interestRate: rate },
    monthlyPayment: result.monthlyPayment,
    totalInterest: result.totalInterest,
    totalCost: result.totalCost,
    debtRatioPercent: debtRatio,
    schedule: result.schedule,
  });
}

// GET /api/loans/monthly-payment?amount=&durationMonths=&interestRate=
export function quickMonthlyPayment(req: AuthenticatedRequest, res: Response) {
  const amount = parseFloat(req.query.amount as string);
  const durationMonths = parseInt(req.query.durationMonths as string, 10);
  const interestRate = parseFloat((req.query.interestRate as string) ?? "3.5");

  if (!amount || !durationMonths) {
    return res.status(400).json({ message: "Paramètres amount et durationMonths requis." });
  }

  const monthlyPayment = computeMonthlyPayment(amount, interestRate, durationMonths);
  res.json({ monthlyPayment });
}

// POST /api/loans/personal
export async function submitPersonalLoan(req: AuthenticatedRequest, res: Response) {
  if (req.body.loanDurationMonths > MAX_LOAN_DURATION_MONTHS) {
    return res.status(400).json({
      message: `La durée du prêt ne peut pas dépasser ${MAX_LOAN_DURATION_MONTHS} mois.`,
    });
  }

  const repo = AppDataSource.getRepository(PersonalLoanApplication);
  const application = repo.create({
    ...req.body,
    userId: req.user?.id ?? null,
  });
  const saved = await repo.save(application);
  res.status(201).json({
    message:
      "Votre demande de prêt personnel a bien été envoyée. Notre équipe vous contactera sous 24 heures.",
    id: (saved as any).id,
  });
}

// POST /api/loans/professional
export async function submitProfessionalLoan(req: AuthenticatedRequest, res: Response) {
  if (req.body.loanDurationMonths > MAX_LOAN_DURATION_MONTHS) {
    return res.status(400).json({
      message: `La durée du prêt ne peut pas dépasser ${MAX_LOAN_DURATION_MONTHS} mois.`,
    });
  }

  const repo = AppDataSource.getRepository(ProfessionalLoanApplication);
  const application = repo.create({
    ...req.body,
    userId: req.user?.id ?? null,
  });
  const saved = await repo.save(application);
  res.status(201).json({
    message:
      "Votre demande de prêt professionnel a bien été envoyée. Notre équipe vous contactera sous 48 heures.",
    id: (saved as any).id,
  });
}

// GET /api/loans/personal — client : ses demandes ; admin/gérant : toutes
export async function listPersonalLoans(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(PersonalLoanApplication);
  const isStaff = req.user!.role === "admin" || req.user!.role === "advisor";
  const items = await repo.find({
    where: isStaff ? {} : { userId: req.user!.id },
    order: { createdAt: "DESC" },
  });
  res.json(items);
}

// GET /api/loans/professional — client : ses demandes ; admin/gérant : toutes
export async function listProfessionalLoans(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(ProfessionalLoanApplication);
  const isStaff = req.user!.role === "admin" || req.user!.role === "advisor";
  const items = await repo.find({
    where: isStaff ? {} : { userId: req.user!.id },
    order: { createdAt: "DESC" },
  });
  res.json(items);
}
