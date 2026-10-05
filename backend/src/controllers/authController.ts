import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { env } from "../config/env";
import { AuthenticatedRequest } from "../middleware/auth";

// POST /api/auth/register — inscription d'un client (en attente de validation)
export async function register(req: AuthenticatedRequest, res: Response) {
  const { email, password, fullName, phone } = req.body as {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  };

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: "Nom, email et mot de passe sont obligatoires." });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir au moins 8 caractères.",
    });
  }

  const repo = AppDataSource.getRepository(User);
  const existing = await repo.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Un compte existe déjà avec cet email." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = repo.create({
    email,
    passwordHash,
    fullName,
    phone,
    role: "client",
    status: "en_attente",
  });
  await repo.save(user);

  res.status(201).json({
    message:
      "Votre demande de création de compte a bien été envoyée. Un gérant doit valider votre compte avant que vous puissiez vous connecter.",
  });
}

// POST /api/auth/login
export async function login(req: AuthenticatedRequest, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }

  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }

  if (user.role === "client" && user.status !== "actif") {
    const reason =
      user.status === "en_attente"
        ? "Votre compte est en attente de validation par un gérant."
        : "Votre demande de compte a été refusée. Contactez-nous pour plus d'informations.";
    return res.status(403).json({ message: reason, status: user.status });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn } as jwt.SignOptions
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
    },
  });
}

// GET /api/auth/me
export async function me(req: AuthenticatedRequest, res: Response) {
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({ where: { id: req.user!.id } });
  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable." });
  }
  res.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    role: user.role,
    status: user.status,
  });
}
