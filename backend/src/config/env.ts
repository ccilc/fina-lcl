import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Variable d'environnement manquante : ${name}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:8080",

  db: {
    host: required("DB_HOST", "localhost"),
    port: parseInt(process.env.DB_PORT ?? "3306", 10),
    username: required("DB_USERNAME", "root"),
    password: process.env.DB_PASSWORD ?? "",
    database: required("DB_DATABASE", "fina_lcl"),
    synchronize: (process.env.DB_SYNCHRONIZE ?? "true") === "true",
    // À activer (DB_SSL=true) pour les bases MySQL gratuites hébergées
    // (ex : Aiven) qui exigent une connexion chiffrée.
    ssl: (process.env.DB_SSL ?? "false") === "true",
  },

  jwt: {
    secret: required("JWT_SECRET", "dev_secret_change_me"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  },

  adminSeed: {
    email: process.env.ADMIN_SEED_EMAIL ?? "admin@finalcl.com",
    password: process.env.ADMIN_SEED_PASSWORD ?? "ChangeMoi123!",
  },
};
