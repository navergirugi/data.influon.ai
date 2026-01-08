import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ comment: '관리자 메모 테이블' })
export class AdminNote {
  @PrimaryGeneratedColumn({ comment: '메모 고유 ID' })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'targetUserId' })
  targetUser: User;

  @Column({ comment: '메모 대상 사용자 ID (FK)' })
  targetUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ comment: '작성자 (관리자) ID (FK)' })
  authorId: string;

  @Column('text', { comment: '메모 내용' })
  content: string;

  @CreateDateColumn({ comment: '작성 일시' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정 일시' })
  updatedAt: Date;
}
