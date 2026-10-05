import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { AccountType, AccountProductType, ApplicationStatus } from "./enums";
import { User } from "./User";

@Entity({ name: "account_requests" })
export class AccountRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fullName!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column({ type: "varchar" })
  accountType!: AccountType;

  // Type de produit : compte courant, épargne libre ou épargne bloquée (compte à terme)
  @Column({ type: "varchar", default: "courant" })
  productType!: AccountProductType;

  // Uniquement pour l'épargne bloquée : durée de blocage choisie, en mois
  @Column({ type: "int", nullable: true })
  lockDurationMonths?: number;

  // Taux d'intérêt indicatif proposé au moment de la demande (%)
  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  proposedInterestRate?: number;

  @Column({ type: "varchar", default: "nouveau" })
  status!: ApplicationStatus;

  // Demande rattachée à un compte client (facultatif : les visiteurs sans
  // compte peuvent aussi soumettre une demande, mais ne verront jamais de liste).
  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "userId" })
  user?: User | null;

  @Column({ type: "varchar", nullable: true })
  userId?: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
