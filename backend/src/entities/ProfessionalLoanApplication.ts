import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Civility, ApplicationStatus } from "./enums";
import { User } from "./User";

export type ProfessionalLoanType =
  | "creation_entreprise"
  | "investissement"
  | "tresorerie"
  | "developpement";

@Entity({ name: "professional_loan_applications" })
export class ProfessionalLoanApplication {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  civility!: Civility;

  @Column()
  fullName!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  companyName!: string;

  @Column({ nullable: true })
  registrationNumber?: string;

  @Column({ nullable: true })
  sector?: string;

  @Column({ type: "varchar" })
  loanType!: ProfessionalLoanType;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  loanAmount!: number;

  @Column({ type: "int" })
  loanDurationMonths!: number;

  @Column({ type: "text", nullable: true })
  projectDescription?: string;

  @Column({ default: false })
  consentDataUsage!: boolean;

  @Column({ default: false })
  consentMarketing!: boolean;

  @Column({ type: "varchar", default: "nouveau" })
  status!: ApplicationStatus;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "userId" })
  user?: User | null;

  @Column({ type: "varchar", nullable: true })
  userId?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
