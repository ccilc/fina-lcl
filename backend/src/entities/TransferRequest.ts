import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BankAccount } from "./BankAccount";
import { User } from "./User";

export type TransferStatus = "en_attente" | "validee" | "rejetee";

/**
 * Demande de virement externe depuis un compte interne FINA LCL vers la
 * banque personnelle du client. Comme pour tout virement bancaire réel,
 * la demande passe par une validation manuelle (contrôle de conformité)
 * avant exécution. Aucun mécanisme de blocage arbitraire d'un pourcentage
 * des fonds n'est appliqué : le client voit en permanence le solde exact
 * disponible sur son compte.
 */
@Entity({ name: "transfer_requests" })
export class TransferRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => BankAccount, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "bankAccountId" })
  bankAccount!: BankAccount;

  @Column()
  bankAccountId!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  amount!: number;

  @Column()
  beneficiaryBankName!: string;

  @Column()
  beneficiaryIban!: string;

  @Column({ type: "varchar", default: "en_attente" })
  status!: TransferStatus;

  @Column({ nullable: true })
  reviewNote?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
