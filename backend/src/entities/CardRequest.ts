import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { CardType, ApplicationStatus } from "./enums";
import { User } from "./User";

@Entity({ name: "card_requests" })
export class CardRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  cardType!: CardType;

  @Column()
  fullName!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

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
