import "reflect-metadata";
import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { AppDataSource } from "./data-source";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/authRoutes";
import loanRoutes from "./routes/loanRoutes";
import cardRoutes from "./routes/cardRoutes";
import accountRoutes from "./routes/accountRoutes";
import investmentRoutes from "./routes/investmentRoutes";
import contactRoutes from "./routes/contactRoutes";
import faqRoutes from "./routes/faqRoutes";
import adminRoutes from "./routes/adminRoutes";
import bankAccountRoutes from "./routes/bankAccountRoutes";
import transferRoutes from "./routes/transferRoutes";

async function bootstrap() {
  await AppDataSource.initialize();
  console.log("✅ Connexion à la base de données MySQL établie.");

  const app = express();

  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "fina-lcl-backend" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/loans", loanRoutes);
  app.use("/api/cards", cardRoutes);
  app.use("/api/accounts", accountRoutes);
  app.use("/api/investments", investmentRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/faq", faqRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/bank-accounts", bankAccountRoutes);
  app.use("/api/transfers", transferRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(env.port, () => {
    console.log(`🚀 FINA LCL API démarrée sur http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Échec du démarrage du serveur :", err);
  process.exit(1);
});
