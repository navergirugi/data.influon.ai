import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';
import { AdminActionType } from './enums';

@Entity()
export class AdminAuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  adminUser: User; // The admin who performed the action

  @Column({ type: 'enum', enum: AdminActionType })
  action: AdminActionType;

  @ManyToOne(() => User, { nullable: true })
  targetUser?: User; // The user being acted upon

  @ManyToOne(() => Campaign, { nullable: true })
  targetCampaign?: Campaign; // The campaign being acted upon

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'jsonb', nullable: true })
  details?: Record<string, any>; // For storing extra info, e.g., point changes

  @CreateDateColumn()
  createdAt: Date;
}
