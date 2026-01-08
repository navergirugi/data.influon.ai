import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { InquiryType, InquiryStatus } from './enums';

@Entity({ comment: '1:1 문의 테이블' })
export class Inquiry {
  @PrimaryGeneratedColumn('uuid', { comment: '문의 고유 ID' })
  id: string;

  @ManyToOne(() => User, (user) => user.inquiries)
  user: User;

  @Column({ comment: '문의 제목' })
  title: string;

  @Column('text', { comment: '문의 내용' })
  content: string;

  @Column({ type: 'enum', enum: InquiryType, enumName: 'inquiry_type_enum', comment: '문의 유형' })
  type: InquiryType;

  @Column({ type: 'enum', enum: InquiryStatus, enumName: 'inquiry_status_enum', default: InquiryStatus.PENDING, comment: '문의 처리 상태' })
  status: InquiryStatus;

  @Column({ type: 'text', nullable: true, comment: '답변 내용' })
  answerContent?: string;

  @Column({ nullable: true, comment: '답변 일시' })
  answeredAt?: Date;

  @CreateDateColumn({ comment: '문의 등록 일시' })
  createdAt: Date;
}
