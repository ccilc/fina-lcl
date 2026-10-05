import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Civility, EmploymentStatus, ApplicationStatus, LoanPurpose } from "./enums";
import { User } from "./User";

@Entity({ name: "personal_loan_applications" })
export class PersonalLoanApplication {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Section 1 : informations personnelles
  @Column({ type: "varchar" })
  civility!: Civility;

  @Column()
  fullName!: string;

  @Column({ type: "date" })
  birthDate!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  street!: string;

  @Column()
  postalCode!: string;

  @Column()
  city!: string;

  @Column()
  country!: string;

  // Section 2 : informations professionnelles
  @Column({ type: "varchar" })
  employmentStatus!: EmploymentStatus;

  @Column({ nullable: true })
  employer?: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  monthlyIncome!: number;

  @Column({ nullable: true })
  seniority?: string;

  // Section 3 : détails du prêt
  @Column({ type: "decimal", precision: 12, scale: 2 })
  loanAmount!: number;

  @Column({ type: "int" })
  loanDurationMonths!: number;

  @Column({ type: "varchar" })
  loanPurpose!: LoanPurpose;

  @Column({ nullable: true })
  loanPurposeOther?: string;

  // Section 5 : consentements
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
