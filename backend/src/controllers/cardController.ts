import { Response } from "express";
import { AppDataSource } from "../data-source";
import { CardRequest } from "../entities/CardRequest";
import { AuthenticatedRequest } from "../middleware/auth";

export async function submitCardRequest(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(CardRequest);
  const entity = repo.create({ ...req.body, userId: req.user?.id ?? null });
  const saved = await repo.save(entity);
  res.status(201).json({
    message: "Votre demande de carte a bien été envoyée. Nous vous contacterons rapidement.",
    id: (saved as any).id,
  });
}

export async function listCardRequests(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(CardRequest);
  const isStaff = req.user!.role === "admin" || req.user!.role === "advisor";
  const items = await repo.find({
    where: isStaff ? {} : { userId: req.user!.id },
    order: { createdAt: "DESC" },
  });
  res.json(items);
}
