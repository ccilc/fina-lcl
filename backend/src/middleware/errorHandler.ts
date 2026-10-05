import { Request, Response, NextFunction } from "express";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Route introuvable : ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const status = err.status ?? 500;
  res.status(status).json({
    message: err.message ?? "Une erreur interne est survenue.",
  });
}

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
