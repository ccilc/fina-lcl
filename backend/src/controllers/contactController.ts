import { Response } from "express";
import { AppDataSource } from "../data-source";
import { ContactMessage } from "../entities/ContactMessage";
import { AuthenticatedRequest } from "../middleware/auth";

export async function submitContactMessage(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(ContactMessage);
  const entity = repo.create({ ...req.body, userId: req.user?.id ?? null });
  const saved = await repo.save(entity);
  res.status(201).json({
    message: "Votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.",
    id: (saved as any).id,
  });
}

export async function listContactMessages(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(ContactMessage);
  const isStaff = req.user!.role === "admin" || req.user!.role === "advisor";
  const items = await repo.find({
    where: isStaff ? {} : { userId: req.user!.id },
    order: { createdAt: "DESC" },
  });
  res.json(items);
}
