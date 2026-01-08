import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { UserStatus } from './enums';

@Entity({ comment: '사용자 상태 변경 이력 테이블' })
export class UserStatusHistory {
  @PrimaryGeneratedColumn({ comment: '이력 고유 ID' })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'targetUserId' })
  targetUser: User;

  @Column({ comment: '상태가 변경된 사용자 ID (FK)' })
  targetUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'changedById' })
  changedBy: User;

  @Column({ comment: '상태를 변경한 관리자 ID (FK)' })
  changedById: string;

  @Column({ type: 'enum', enum: UserStatus, comment: '이전 상태' })
  previousStatus: UserStatus;

  @Column({ type: 'enum', enum: UserStatus, comment: '새로운 상태' })
  newStatus: UserStatus;

  @Column({ nullable: true, comment: '변경 사유' })
  reason?: string;

  @CreateDateColumn({ comment: '변경 일시' })
  createdAt: Date;
}
