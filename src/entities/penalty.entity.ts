import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';
import { PenaltyType } from './enums';

@Entity({ comment: '사용자 페널티 내역 테이블' })
export class Penalty {
  @PrimaryGeneratedColumn('uuid', { comment: '페널티 고유 ID' })
  id: string;

  @ManyToOne(() => User, (user) => user.penalties)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ comment: '사용자 ID (FK)' })
  userId: string;

  @Column({ type: 'enum', enum: PenaltyType, enumName: 'penalty_type_enum', comment: '페널티 유형 (APPLIED: 적용됨, RELEASED: 해제됨)' })
  type: PenaltyType;

  @Column({ comment: '페널티 사유' })
  reason: string;

  @CreateDateColumn({ comment: '페널티 적용 일시' })
  appliedAt: Date;

  @Column({ nullable: true, comment: '페널티 해제 일시' })
  releasedAt?: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.penalties, { nullable: true })
  @JoinColumn({ name: 'campaignId' })
  campaign?: Campaign;

  @Column({ nullable: true, comment: '관련 캠페인 ID (FK)' })
  campaignId?: number;
}
