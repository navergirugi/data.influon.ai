import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum DeviceType {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web', // WEB 추가
}

@Entity({ comment: '사용자 디바이스 토큰 테이블 (푸시 알림용)' })
export class DeviceToken {
  @PrimaryGeneratedColumn({ comment: '디바이스 토큰 고유 ID' })
  id: number;

  @Column({ comment: 'FCM 토큰 값' })
  token: string;

  @Column({ 
    type: 'enum', 
    enum: DeviceType, 
    enumName: 'device_type_enum', 
    default: DeviceType.WEB, // 기본값 추가 (기존 NULL 데이터 처리용)
    comment: '디바이스 유형 (ANDROID, IOS, WEB)' 
  })
  deviceType: DeviceType;

  @Column({ default: true, comment: '알림 수신 동의 여부' }) // isActive 추가
  isActive: boolean;

  @CreateDateColumn({ comment: '토큰 등록 일시' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '토큰 수정 일시' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.deviceTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true, comment: '사용자 ID (FK)' })
  userId: string;
}
