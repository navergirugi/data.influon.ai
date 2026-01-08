import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, OneToOne } from 'typeorm';
import { SocialConnection } from './social-connection.entity';
import { CampaignApplication } from './campaign-application.entity';
import { PointTransaction } from './point-transaction.entity';
import { Penalty } from './penalty.entity';
import { Favorite } from './favorite.entity';
import { Inquiry } from './inquiry.entity';
import { Notification } from './notification.entity';
import { DeviceToken } from './device-token.entity';
import { Gender, UserRole, BusinessStatus, UserStatus } from './enums';
import { Wallet } from './wallet.entity';

@Entity({ comment: '사용자 정보 테이블' })
export class User {
  @PrimaryGeneratedColumn('uuid', { comment: '사용자 고유 ID' })
  id: string;

  @Column({ unique: true, comment: '로그인 이메일' })
  email: string;

  @Column({ nullable: true, comment: '암호화된 비밀번호 (소셜 로그인의 경우 null)' })
  password?: string;

  @Column({ comment: '사용자 실명' })
  name: string;

  @Column({ unique: true, comment: '닉네임' })
  nickname: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.INFLUENCER, comment: '사용자 역할' })
  role: UserRole;

  @Column({ nullable: true, comment: '프로필 이미지 URL' })
  profileImage?: string;

  @Column({ nullable: true, comment: '주요 활동 지역' })
  location?: string;

  @Column({ nullable: true, comment: '출생년도' })
  birthYear?: string;

  @Column({ type: 'enum', enum: Gender, enumName: 'gender_enum', nullable: true, comment: '성별' })
  gender?: Gender;

  @Column({ nullable: true, comment: '연락처' })
  phone?: string;

  @Column({ default: 0, comment: '레거시 포인트 필드 (Wallet 시스템으로 이전됨)' })
  points: number;

  // Advertiser specific fields
  @Column({ nullable: true, comment: '광고주: 상호명' })
  businessName?: string;

  @Column({ nullable: true, comment: '광고주: 사업자 등록번호' })
  businessNumber?: string;

  @Column({ nullable: true, comment: '광고주: 사업자 등록증 이미지 URL' })
  businessRegistration?: string;

  @Column({ type: 'enum', enum: BusinessStatus, nullable: true, default: BusinessStatus.PENDING, comment: '광고주: 사업자 승인 상태' })
  businessStatus?: BusinessStatus;

  @Column({ nullable: true, comment: '광고주: 승인 거절 사유' })
  rejectionReason?: string;

  // User status
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE, comment: '계정 상태 (ACTIVE: 활성, INACTIVE: 휴면, SUSPENDED: 정지, BANNED: 영구정지)' })
  status: UserStatus;

  @Column({ nullable: true, comment: '마지막 로그인 일시' })
  lastLoginAt?: Date;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;

  @CreateDateColumn({ comment: '가입 일시' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정 일시' })
  updatedAt: Date;

  @DeleteDateColumn({ comment: '탈퇴(삭제) 일시' })
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
