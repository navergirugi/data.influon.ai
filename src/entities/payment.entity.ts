import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum PaymentStatus {
  PENDING = 'PENDING', // 결제 대기
  PAID = 'PAID',       // 결제 완료
  FAILED = 'FAILED',     // 결제 실패
  CANCELLED = 'CANCELLED', // 결제 취소
}

export enum PaymentGateway {
  TOSS = 'TOSS',
  IAMPORT = 'IAMPORT',
  MANUAL = 'MANUAL', // 수동 지급
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User; // 결제한 사용자 (광고주)

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number; // 결제 금액

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentGateway })
  paymentGateway: PaymentGateway;

  @Column({ unique: true, comment: 'PG사 거래 고유 ID' })
  pgTransactionId: string; // 아임포트 imp_uid, 토스 paymentKey 등

  @Column({ type: 'jsonb', nullable: true, comment: 'PG사로부터 받은 전체 응답' })
  pgResponse: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
