import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./config/env";

import { User } from "./entities/User";
import { PersonalLoanApplication } from "./entities/PersonalLoanApplication";
import { ProfessionalLoanApplication } from "./entities/ProfessionalLoanApplication";
import { CardRequest } from "./entities/CardRequest";
import { AccountRequest } from "./entities/AccountRequest";
import { SavingsSimulation } from "./entities/SavingsSimulation";
import { InvestmentAccountRequest } from "./entities/InvestmentAccountRequest";
import { WebinarRegistration } from "./entities/WebinarRegistration";
import { ContactMessage } from "./entities/ContactMessage";
import { BankAccount } from "./entities/BankAccount";
import { AccountTransaction } from "./entities/AccountTransaction";
import { TransferRequest } from "./entities/TransferRequest";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: env.db.synchronize, // true en dev : crée/adapte les tables automatiquement
  logging: env.nodeEnv === "development" ? ["error", "warn"] : false,
    // Nécessaire pour la plupart des bases MySQL gratuites hébergées (ex : Aiven),
  // qui exigent une connexion chiffrée. En local avec MySQL sur votre machine,
  // laissez DB_SSL=false (valeur par défaut).
  ssl: env.db.ssl ? { rejectUnauthorized: false } : undefined,
  entities: [
    User,
    PersonalLoanApplication,
    ProfessionalLoanApplication,
    CardRequest,
    AccountRequest,
    SavingsSimulation,
    InvestmentAccountRequest,
    WebinarRegistration,
    ContactMessage,
    BankAccount,
    AccountTransaction,
    TransferRequest,
  ],
  migrations: ["dist/migrations/*.js"],
  subscribers: [],
});
