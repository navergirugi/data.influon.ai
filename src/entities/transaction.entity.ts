import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Wallet } from './wallet.entity';
import { User } from './user.entity';
import { TransactionType } from './enums';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  balanceAfter: number; // Snapshot of balance after transaction

  @Column({ nullable: true })
  currency: 'CASH' | 'POINT';

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  relatedId?: string; // Campaign ID, Withdrawal ID, etc.

  @ManyToOne(() => User, { nullable: true })
  adminUser?: User; // If adjusted by admin

  @CreateDateColumn()
  createdAt: Date;
}
