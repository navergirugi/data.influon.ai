import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Wallet } from './wallet.entity';
import { User } from './user.entity';
import { TransactionType } from './enums';

@Entity({ comment: '자산 변동 내역(트랜잭션) 테이블' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid', { comment: '트랜잭션 고유 ID' })
  id: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @Column({ comment: '지갑 ID (FK)' })
  walletId: string;

  @Column({ type: 'enum', enum: TransactionType, comment: '트랜잭션 유형' })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '변동 금액 (+/-)' })
  amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, comment: '변동 후 잔액' })
  balanceAfter: number;

  @Column({ nullable: true, comment: '자산 종류 (CASH 또는 POINT)' })
  currency: 'CASH' | 'POINT';

  @Column({ nullable: true, comment: '내역 설명' })
  description?: string;

  @Column({ nullable: true, comment: '관련 데이터 ID (캠페인 ID, 출금 요청 ID 등)' })
  relatedId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'adminUserId' })
  adminUser?: User;

  @Column({ nullable: true, comment: '관리자에 의한 조정인 경우 해당 관리자 ID (FK)' })
  adminUserId?: string;

  @Column({ type: 'timestamp', nullable: true, comment: '포인트 만료 일시' })
  expiresAt?: Date;

  @CreateDateColumn({ comment: '생성 일시' })
  createdAt: Date;
}
