import "reflect-metadata";
import bcrypt from "bcryptjs";
import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import { env } from "./config/env";

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);

  const existing = await repo.findOne({ where: { email: env.adminSeed.email } });
  if (existing) {
    console.log(`ℹ️  L'administrateur ${env.adminSeed.email} existe déjà.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(env.adminSeed.password, 10);
  const admin = repo.create({
    email: env.adminSeed.email,
    passwordHash,
    fullName: "Administrateur FINA LCL",
    role: "admin",
    status: "actif",
  });

  await repo.save(admin);
  console.log(`✅ Administrateur créé : ${env.adminSeed.email}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Échec du seed :", err);
  process.exit(1);
});
