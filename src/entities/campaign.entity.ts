import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { CampaignApplication } from './campaign-application.entity';
import { Penalty } from './penalty.entity';
import { Favorite } from './favorite.entity';
import { Platform, CampaignStatus } from './enums';
import { User } from './user.entity';

@Entity({ comment: '캠페인 정보 테이블' })
export class Campaign {
  @PrimaryGeneratedColumn({ comment: '캠페인 고유 ID' })
  id: number;

  @Column({ comment: '캠페인 제목' })
  title: string;

  @Column({ nullable: true, comment: '캠페인 부제목' })
  subTitle?: string;

  @Column({ comment: '매장/브랜드 이름' })
  shopName: string;

  @Column({ comment: '대표 이미지 URL' })
  image: string;

  @Column({ type: 'enum', enum: Platform, enumName: 'platform_enum', comment: '주요 홍보 플랫폼 (e.g., INSTAGRAM, YOUTUBE)' })
  platform: Platform;

  @Column({ comment: '캠페인 카테고리 (e.g., 맛집, 뷰티)' })
  category: string;

  @Column({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.PENDING_APPROVAL, comment: '캠페인 상태' })
  status: CampaignStatus;

  @Column({ nullable: true, comment: '관리자 승인 거절 사유' })
  rejectionReason?: string;

  @Column({ comment: '캠페인 진행 기간 (YYYY.MM.DD-YYYY.MM.DD)' })
  period: string;

  @Column({ comment: '인플루언서 발표일' })
  announcementDate: Date;

  @Column({ comment: '리뷰 등록 마감일' })
  reviewDeadline: Date;

  @Column({ default: false, comment: '동영상 필수 여부' })
  hasVideo: boolean;

  @Column('text', { array: true, comment: '검색용 키워드 배열' })
  keywords: string[];

  // Detail fields
  @Column({ type: 'text', nullable: true, comment: '제공 서비스 상세' })
  serviceDetail?: string;

  @Column({ type: 'text', nullable: true, comment: '캠페인 미션 가이드' })
  missionGuide?: string;

  @Column({ type: 'text', nullable: true, comment: '캠페인 공지사항' })
  notice?: string;

  @Column({ nullable: true, comment: '동반 가능 인원 정보' })
  companionCount?: string;

  @Column({ nullable: true, comment: '리뷰 유지 기간' })
  reviewMaintenance?: string;

  @Column({ nullable: true, comment: '필수 스폰서 태그' })
  sponsoredTag?: string;

  @Column({ nullable: true, comment: '매장 주소' })
  address?: string;

  @Column({ type: 'float', nullable: true, comment: '주소 위도' })
  lat?: number;

  @Column({ type: 'float', nullable: true, comment: '주소 경도' })
  lng?: number;

  @Column({ nullable: true, comment: '휴무일 정보' })
  offDays?: string;

  @Column({ nullable: true, comment: '브레이크 타임 정보' })
  breakTime?: string;

  @Column({ nullable: true, comment: '예약 가능 시간 정보' })
  availableTime?: string;

  @Column({ nullable: true, comment: '참고 블로그/사이트 URL' })
  blogUrl?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'advertiserId' })
  advertiser: User;

  @Column({ nullable: true, comment: '캠페인을 등록한 광고주 ID (FK)' })
  advertiserId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdByAdminId' })
  createdByAdmin?: User;

  @Column({ nullable: true, comment: '관리자가 대리 등록한 경우 해당 관리자 ID (FK)' })
  createdByAdminId?: string;

  @CreateDateColumn({ comment: '생성 일시' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정 일시' })
  updatedAt: Date;

  @OneToMany(() => CampaignApplication, (app) => app.campaign)
  applications: CampaignApplication[];

  @OneToMany(() => Penalty, (penalty) => penalty.campaign)
  penalties: Penalty[];

  @OneToMany(() => Favorite, (fav) => fav.campaign)
  favorites: Favorite[];
}
