import { Entity, CreateDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';

@Entity()
export class Favorite {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  campaignId: number;

  @ManyToOne(() => User, (user) => user.favorites)
  user: User;

  @ManyToOne(() => Campaign, (campaign) => campaign.favorites)
  campaign: Campaign;

  @CreateDateColumn()
  createdAt: Date;
}
