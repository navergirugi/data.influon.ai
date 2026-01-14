import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  CAMPAIGN_APPLY = 'CAMPAIGN_APPLY',
  CAMPAIGN_SELECTED = 'CAMPAIGN_SELECTED',
  CAMPAIGN_REJECTED = 'CAMPAIGN_REJECTED',
  CAMPAIGN_STATUS_CHANGE = 'CAMPAIGN_STATUS_CHANGE',
  POINT_PAYMENT = 'POINT_PAYMENT',
  MARKETING = 'MARKETING',
  SYSTEM = 'SYSTEM',
}

@Entity({ comment: '사용자 알림 테이블' })
export class Notification {
  @PrimaryGeneratedColumn('uuid', { comment: '알림 고유 ID' })
  id: string;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column({ comment: '알림 제목' })
  title: string;

  @Column({ comment: '알림 메시지' })
  message: string; // body 대신 message 사용

  @Column({ 
    type: 'enum', 
    enum: NotificationType, 
    nullable: true, 
    comment: '알림 유형 (e.g., CAMPAIGN_RESULT, POINT_EARNED)' 
  })
  type?: NotificationType;

  @Column({ nullable: true, comment: '관련 데이터 (JSON)' })
  data?: string;

  @Column({ default: false, comment: '사용자 읽음 여부' })
  isRead: boolean;

  @CreateDateColumn({ comment: '알림 생성 일시' })
  createdAt: Date;
}
