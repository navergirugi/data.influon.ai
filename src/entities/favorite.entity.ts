import { Entity, CreateDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';

@Entity({ comment: '사용자 찜(관심) 캠페인 테이블' })
export class Favorite {
  @PrimaryColumn({ comment: '사용자 ID' })
  userId: string;

  @PrimaryColumn({ comment: '캠페인 ID' })
  campaignId: number;

  @ManyToOne(() => User, (user) => user.favorites)
  user: User;

  @ManyToOne(() => Campaign, (campaign) => campaign.favorites)
  campaign: Campaign;

  @CreateDateColumn({ comment: '찜한 일시' })
  createdAt: Date;
}
