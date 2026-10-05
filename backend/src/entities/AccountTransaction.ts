import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BankAccount } from "./BankAccount";

export type TransactionType = "credit_pret" | "depot" | "interet" | "virement_sortant";

/**
 * Historique des mouvements sur un compte interne (ex : crédit d'un prêt
 * approuvé, intérêts versés, virement sortant exécuté). Permet au client de
 * voir le détail de son solde de façon transparente.
 */
@Entity({ name: "account_transactions" })
export class AccountTransaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => BankAccount, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "bankAccountId" })
  bankAccount!: BankAccount;

  @Column()
  bankAccountId!: string;

  @Column({ type: "varchar" })
  type!: TransactionType;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  amount!: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  balanceAfter!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
