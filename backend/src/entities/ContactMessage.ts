import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "contact_messages" })
export class ContactMessage {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fullName!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  subject?: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ default: false })
  handled!: boolean;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "userId" })
  user?: User | null;

  @Column({ type: "varchar", nullable: true })
  userId?: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
