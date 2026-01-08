import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';
import { Platform } from './enums';

@Entity({ comment: '사용자 소셜 미디어 연동 정보 테이블' })
@Unique(['user', 'platform'])
export class SocialConnection {
  @PrimaryGeneratedColumn('uuid', { comment: '연동 정보 고유 ID' })
  id: string;

  @ManyToOne(() => User, (user) => user.socialConnections)
  user: User;

  @Column({ type: 'enum', enum: Platform, enumName: 'platform_enum', comment: '소셜 플랫폼 종류' })
  platform: Platform;

  @Column({ comment: '소셜 플랫폼에서 제공하는 사용자 고유 ID' })
  providerId: string;

  @Column({ nullable: true, comment: '소셜 플랫폼 API 접근 토큰 (암호화 필요)' })
  accessToken?: string;

  @Column({ default: true, comment: '현재 연동 상태 여부' })
  isConnected: boolean;

  @Column({ nullable: true, comment: '사용자 소셜 채널 URL' })
  url?: string;
}
