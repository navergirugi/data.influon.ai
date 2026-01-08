import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ comment: '사용자 알림 테이블' })
export class Notification {
  @PrimaryGeneratedColumn('uuid', { comment: '알림 고유 ID' })
  id: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @Column({ comment: '알림 제목' })
  title: string;

  @Column({ comment: '알림 메시지' })
  message: string;

  @Column({ nullable: true, comment: '알림 유형 (e.g., CAMPAIGN_RESULT, POINT_EARNED)' })
  type?: string;

  @Column({ default: false, comment: '사용자 읽음 여부' })
  isRead: boolean;

  @CreateDateColumn({ comment: '알림 생성 일시' })
  createdAt: Date;
}
