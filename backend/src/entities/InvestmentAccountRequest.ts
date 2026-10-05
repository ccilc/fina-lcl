import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { RiskProfile, InvestmentGoal, ApplicationStatus } from "./enums";
import { User } from "./User";

@Entity({ name: "investment_account_requests" })
export class InvestmentAccountRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fullName!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column({ type: "varchar" })
  riskProfile!: RiskProfile;

  @Column({ type: "varchar" })
  investmentGoal!: InvestmentGoal;

  @Column({ type: "varchar", default: "nouveau" })
  status!: ApplicationStatus;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "userId" })
  user?: User | null;

  @Column({ type: "varchar", nullable: true })
  userId?: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
