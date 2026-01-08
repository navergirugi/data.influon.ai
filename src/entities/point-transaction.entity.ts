import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { PointType, PointStatus } from './enums';

@Entity({ comment: '포인트 변동 내역 테이블 (레거시, Transaction 테이블로 대체됨)' })
export class PointTransaction {
  @PrimaryGeneratedColumn('uuid', { comment: '포인트 트랜잭션 고유 ID' })
  id: string;

  @ManyToOne(() => User, (user) => user.pointTransactions)
  user: User;

  @Column({ type: 'enum', enum: PointType, enumName: 'point_type_enum', comment: '유형 (EARN: 적립, WITHDRAW: 출금, PENDING: 대기)' })
  type: PointType;

  @Column({ comment: '변동 포인트 금액' })
  amount: number;

  @Column({ type: 'enum', enum: PointStatus, enumName: 'point_status_enum', comment: '상태 (PROCESSING: 처리중, COMPLETED: 완료, CANCELED: 취소)' })
  status: PointStatus;

  @Column({ nullable: true, comment: '내역 설명' })
  description?: string;

  @CreateDateColumn({ comment: '생성 일시' })
  createdAt: Date;
}
