import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

@Entity({ comment: '사용자 자산(지갑) 테이블' })
export class Wallet {
  @PrimaryGeneratedColumn('uuid', { comment: '지갑 고유 ID' })
  id: string;

  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn()
  user: User;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0, comment: '현금 잔액 (광고주 충전금)' })
  cashBalance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0, comment: '포인트 잔액 (인플루언서 수익금)' })
  pointBalance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];

  @CreateDateColumn({ comment: '생성 일시' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정 일시' })
  updatedAt: Date;
}
