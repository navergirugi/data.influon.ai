import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { InquiryType, InquiryStatus } from './enums';

@Entity()
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.inquiries)
  user: User;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'enum', enum: InquiryType, enumName: 'inquiry_type_enum' })
  type: InquiryType;

  @Column({ type: 'enum', enum: InquiryStatus, enumName: 'inquiry_status_enum', default: InquiryStatus.PENDING })
  status: InquiryStatus;

  @Column({ type: 'text', nullable: true })
  answerContent?: string;

  @Column({ nullable: true })
  answeredAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
