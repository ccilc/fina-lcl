import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentification requise." });
  }

  const token = header.substring("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.jwt.secret) as {
      id: string;
      email: string;
      role: string;
    };
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Jeton invalide ou expiré." });
  }
}

/**
 * Attache l'utilisateur à la requête s'il présente un token JWT valide,
 * mais laisse passer les requêtes anonymes (pas de token) sans erreur.
 * Utilisé sur les formulaires de demande accessibles sans compte : si la
 * personne est connectée, sa demande est rattachée automatiquement.
 */
export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next();
  }

  const token = header.substring("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.jwt.secret) as {
      id: string;
      email: string;
      role: string;
    };
    req.user = payload;
  } catch (err) {
    // Token invalide ou expiré : on continue en mode anonyme plutôt que
    // de bloquer la soumission du formulaire.
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé." });
    }
    next();
  };
}
