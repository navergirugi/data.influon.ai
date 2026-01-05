import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';
import { PenaltyType } from './enums';

@Entity()
export class Penalty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.penalties)
  user: User;

  @Column({ type: 'enum', enum: PenaltyType, enumName: 'penalty_type_enum' })
  type: PenaltyType;

  @Column()
  reason: string;

  @CreateDateColumn()
  appliedAt: Date;

  @Column({ nullable: true })
  releasedAt?: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.penalties, { nullable: true })
  campaign?: Campaign;
}
