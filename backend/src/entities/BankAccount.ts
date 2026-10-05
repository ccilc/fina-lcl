import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { AccountProductType } from "./enums";
import { User } from "./User";

export type BankAccountStatus = "actif" | "cloture";

/**
 * Compte bancaire interne réel, créé par un administrateur/gérant lorsqu'il
 * valide une demande d'ouverture de compte (AccountRequest). C'est sur ce
 * compte que sont crédités les prêts approuvés.
 */
@Entity({ name: "bank_accounts" })
export class BankAccount {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;

  // Numéro de compte généré (ex : FINA-2024-000123)
  @Column({ unique: true })
  accountNumber!: string;

  @Column({ type: "varchar" })
  productType!: AccountProductType;

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  balance!: number;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  interestRate!: number;

  // Pour l'épargne bloquée uniquement
  @Column({ type: "int", nullable: true })
  lockDurationMonths?: number;

  @Column({ type: "date", nullable: true })
  lockEndDate?: string;

  @Column({ type: "varchar", default: "actif" })
  status!: BankAccountStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
