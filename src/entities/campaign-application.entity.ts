import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';
import { ApplicationStatus, ReviewStatus, VisitStatus } from './enums';

@Entity({ comment: '캠페인 지원(신청) 내역 테이블' })
@Unique(['campaign', 'user'])
export class CampaignApplication {
  @PrimaryGeneratedColumn({ comment: '지원 내역 고유 ID' })
  id: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.applications)
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @Column({ comment: '지원한 캠페인 ID (FK)' })
  campaignId: number;

  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ comment: '지원한 인플루언서 ID (FK)' })
  userId: string;

  @Column({ 
    type: 'enum', 
    enum: ApplicationStatus, 
    enumName: 'application_status_enum', 
    default: ApplicationStatus.APPLYING,
    comment: '지원 상태 (APPLYING: 지원중, SELECTED: 선정됨, NOT_SELECTED: 탈락, CANCELED: 취소)'
  })
  status: ApplicationStatus;

  @Column({ nullable: true, comment: '참여 형태 (예: 방문형, 기자단 등)' })
  participationType?: string;

  @Column({ default: 0, comment: '리워드 포인트 (지급 예정 포인트)' })
  rewardPoint: number;

  @Column({ nullable: true, comment: '방문 예정 날짜' })
  visitDate?: Date;

  @Column({ nullable: true, comment: '방문 예정 시간' })
  visitTime?: string;

  @Column({ default: 0, comment: '동반 인원 수' })
  companionCount: number;

  @Column({ nullable: true, comment: '작성한 리뷰 URL' })
  reviewUrl?: string;

  @Column({ 
    type: 'enum', 
    enum: ReviewStatus, 
    enumName: 'review_status_enum', 
    default: ReviewStatus.REVIEW_PENDING,
    comment: '리뷰 작성 상태 (REVIEW_PENDING: 작성 대기, REVIEW_COMPLETED: 작성 완료)'
  })
  reviewStatus: ReviewStatus;

  @Column({ 
    type: 'enum', 
    enum: VisitStatus, 
    enumName: 'visit_status_enum', 
    default: VisitStatus.VISIT_PENDING,
    comment: '방문 상태 (VISIT_PENDING: 방문 대기, VISIT_COMPLETED: 방문 완료, VISIT_NOT_COMPLETED: 노쇼)'
  })
  visitStatus: VisitStatus;

  @Column({ nullable: true, comment: '결과 상태 (비고)' })
  resultStatus?: string;

  @CreateDateColumn({ comment: '지원 일시' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정 일시' })
  updatedAt: Date;
}
