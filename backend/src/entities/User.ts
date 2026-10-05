import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

// admin / advisor (gérant) : personnel interne, toujours actif
// client : utilisateur final, doit être validé par un admin/gérant avant de pouvoir se connecter
export type UserRole = "admin" | "advisor" | "client";

export type UserStatus = "en_attente" | "actif" | "rejete";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  fullName!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: "varchar", default: "client" })
  role!: UserRole;

  // Les comptes admin/advisor sont créés déjà actifs (via le script de seed
  // ou par un autre admin) ; les comptes client doivent être validés.
  @Column({ type: "varchar", default: "en_attente" })
  status!: UserStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
