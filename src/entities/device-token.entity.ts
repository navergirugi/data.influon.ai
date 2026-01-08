import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum DeviceType {
  ANDROID = 'android',
  IOS = 'ios',
}

@Entity({ comment: '사용자 디바이스 토큰 테이블 (푸시 알림용)' })
export class DeviceToken {
  @PrimaryGeneratedColumn({ comment: '디바이스 토큰 고유 ID' })
  id: number;

  @Column({ comment: 'FCM 토큰 값' })
  token: string;

  @Column({ type: 'enum', enum: DeviceType, enumName: 'device_type_enum', comment: '디바이스 유형 (ANDROID, IOS)' })
  deviceType: DeviceType;

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
