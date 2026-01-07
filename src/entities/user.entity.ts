import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { SocialConnection } from './social-connection.entity';
import { CampaignApplication } from './campaign-application.entity';
import { PointTransaction } from './point-transaction.entity';
import { Penalty } from './penalty.entity';
import { Favorite } from './favorite.entity';
import { Inquiry } from './inquiry.entity';
import { Notification } from './notification.entity';
import { DeviceToken } from './device-token.entity';
import { Gender, UserRole, BusinessStatus, UserStatus } from './enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  name: string;

  @Column({ unique: true })
  nickname: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.INFLUENCER })
  role: UserRole;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  birthYear?: string;

  @Column({ type: 'enum', enum: Gender, enumName: 'gender_enum', nullable: true })
  gender?: Gender;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: 0 })
  points: number;

  // Advertiser specific fields
  @Column({ nullable: true })
  businessName?: string;

  @Column({ nullable: true })
  businessNumber?: string;

  @Column({ nullable: true })
  businessRegistration?: string; // URL or path to the registration file

  @Column({ type: 'enum', enum: BusinessStatus, nullable: true, default: BusinessStatus.PENDING })
  businessStatus?: BusinessStatus;

  @Column({ nullable: true })
  rejectionReason?: string;

  // User status
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => SocialConnection, (social) => social.user)
  socialConnections: SocialConnection[];

  @OneToMany(() => CampaignApplication, (app) => app.user)
  applications: CampaignApplication[];

  @OneToMany(() => PointTransaction, (tx) => tx.user)
  pointTransactions: PointTransaction[];

  @OneToMany(() => Penalty, (penalty) => penalty.user)
  penalties: Penalty[];

  @OneToMany(() => Favorite, (fav) => fav.user)
  favorites: Favorite[];

  @OneToMany(() => Inquiry, (inquiry) => inquiry.user)
  inquiries: Inquiry[];

  @OneToMany(() => Notification, (noti) => noti.user)
  notifications: Notification[];

  @OneToMany(() => DeviceToken, (token) => token.user)
  deviceTokens: DeviceToken[];
}
