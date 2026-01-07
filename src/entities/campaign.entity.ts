import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { CampaignApplication } from './campaign-application.entity';
import { Penalty } from './penalty.entity';
import { Favorite } from './favorite.entity';
import { Platform, CampaignStatus } from './enums';
import { User } from './user.entity';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  subTitle?: string;

  @Column()
  shopName: string;

  @Column()
  image: string;

  @Column({ type: 'enum', enum: Platform, enumName: 'platform_enum' })
  platform: Platform;

  @Column()
  category: string;

  @Column({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.PENDING_APPROVAL })
  status: CampaignStatus;

  @Column({ nullable: true })
  rejectionReason?: string;

  @Column()
  period: string;

  @Column()
  announcementDate: Date;

  @Column()
  reviewDeadline: Date;

  @Column({ default: false })
  hasVideo: boolean;

  @Column('text', { array: true })
  keywords: string[];

  // Detail fields
  @Column({ type: 'text', nullable: true })
  serviceDetail?: string;

  @Column({ type: 'text', nullable: true })
  missionGuide?: string;

  @Column({ type: 'text', nullable: true })
  notice?: string;

  @Column({ nullable: true })
  companionCount?: string;

  @Column({ nullable: true })
  reviewMaintenance?: string;

  @Column({ nullable: true })
  sponsoredTag?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'float', nullable: true })
  lat?: number;

  @Column({ type: 'float', nullable: true })
  lng?: number;

  @Column({ nullable: true })
  offDays?: string;

  @Column({ nullable: true })
  breakTime?: string;

  @Column({ nullable: true })
  availableTime?: string;

  @Column({ nullable: true })
  blogUrl?: string;

  @ManyToOne(() => User, { nullable: true })
  advertiser: User;

  @ManyToOne(() => User, { nullable: true })
  createdByAdmin?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CampaignApplication, (app) => app.campaign)
  applications: CampaignApplication[];

  @OneToMany(() => Penalty, (penalty) => penalty.campaign)
  penalties: Penalty[];

  @OneToMany(() => Favorite, (fav) => fav.campaign)
  favorites: Favorite[];
}
