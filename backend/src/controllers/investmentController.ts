import { Response } from "express";
import { AppDataSource } from "../data-source";
import { InvestmentAccountRequest } from "../entities/InvestmentAccountRequest";
import { WebinarRegistration } from "../entities/WebinarRegistration";
import { AuthenticatedRequest } from "../middleware/auth";

export async function submitInvestmentAccount(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(InvestmentAccountRequest);
  const entity = repo.create({ ...req.body, userId: req.user?.id ?? null });
  const saved = await repo.save(entity);
  res.status(201).json({
    message: "Votre demande d'ouverture de compte investissement a bien été envoyée.",
    id: (saved as any).id,
  });
}

export async function listInvestmentAccounts(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(InvestmentAccountRequest);
  const isStaff = req.user!.role === "admin" || req.user!.role === "advisor";
  const items = await repo.find({
    where: isStaff ? {} : { userId: req.user!.id },
    order: { createdAt: "DESC" },
  });
  res.json(items);
}

export async function registerWebinar(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(WebinarRegistration);
  const entity = repo.create({ ...req.body, userId: req.user?.id ?? null });
  const saved = await repo.save(entity);
  res.status(201).json({
    message: "Votre inscription au webinaire est confirmée. Un email de rappel vous sera envoyé.",
    id: (saved as any).id,
  });
}

export async function listWebinarRegistrations(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(WebinarRegistration);
  const isStaff = req.user!.role === "admin" || req.user!.role === "advisor";
  const items = await repo.find({
    where: isStaff ? {} : { userId: req.user!.id },
    order: { createdAt: "DESC" },
  });
  res.json(items);
}
