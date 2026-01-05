import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';
import { ApplicationStatus, ReviewStatus, VisitStatus } from './enums';

@Entity()
@Unique(['campaign', 'user'])
export class CampaignApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.applications)
  campaign: Campaign;

  @ManyToOne(() => User, (user) => user.applications)
  user: User;

  @Column({ type: 'enum', enum: ApplicationStatus, enumName: 'application_status_enum', default: ApplicationStatus.APPLYING })
  status: ApplicationStatus;

  @Column({ nullable: true })
  participationType?: string;

  @Column({ default: 0 })
  rewardPoint: number;

  @Column({ nullable: true })
  visitDate?: Date;

  @Column({ nullable: true })
  visitTime?: string;

  @Column({ default: 0 })
  companionCount: number;

  @Column({ nullable: true })
  reviewUrl?: string;

  @Column({ type: 'enum', enum: ReviewStatus, enumName: 'review_status_enum', default: ReviewStatus.REVIEW_PENDING })
  reviewStatus: ReviewStatus;

  @Column({ type: 'enum', enum: VisitStatus, enumName: 'visit_status_enum', default: VisitStatus.VISIT_PENDING })
  visitStatus: VisitStatus;

  @Column({ nullable: true })
  resultStatus?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
