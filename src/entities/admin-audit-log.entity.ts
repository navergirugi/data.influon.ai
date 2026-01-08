import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Campaign } from "./campaign.entity";
import { AdminActionType } from "./enums";

@Entity({ comment: "관리자 활동 감사 로그 테이블" })
export class AdminAuditLog {
  @PrimaryGeneratedColumn({ comment: "로그 고유 ID" })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'adminUserId' })
  adminUser: User;

  @Column({ comment: '활동을 수행한 관리자 ID (FK)' })
  adminUserId: string;

  @Column({ type: "enum", enum: AdminActionType, comment: "활동 유형" })
  action: AdminActionType;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'targetUserId' })
  targetUser?: User;

  @Column({ nullable: true, comment: '활동 대상 사용자 ID (FK)' })
  targetUserId?: string;

  @ManyToOne(() => Campaign, { nullable: true })
  @JoinColumn({ name: 'targetCampaignId' })
  targetCampaign?: Campaign;

  @Column({ nullable: true, comment: '활동 대상 캠페인 ID (FK)' })
  targetCampaignId?: number;

  @Column({ type: "text", comment: "활동 사유" })
  reason: string;

  @Column({ type: "jsonb", nullable: true, comment: "추가 정보 (JSON 형식)" })
  details?: Record<string, any>;

  @CreateDateColumn({ comment: "생성 일시" })
  createdAt: Date;
}
