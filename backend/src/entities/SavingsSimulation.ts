import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "savings_simulations" })
export class SavingsSimulation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  monthlyAmount!: number;

  @Column({ type: "int" })
  durationMonths!: number;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  interestRate!: number;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  finalCapital!: number;

  @Column({ type: "decimal", precision: 14, scale: 2 })
  totalInterest!: number;

  @Column({ nullable: true })
  email?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
