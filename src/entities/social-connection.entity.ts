import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';
import { Platform } from './enums';

@Entity()
@Unique(['user', 'platform'])
export class SocialConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.socialConnections)
  user: User;

  @Column({ type: 'enum', enum: Platform, enumName: 'platform_enum' })
  platform: Platform;

  @Column()
  providerId: string;

  @Column({ nullable: true })
  accessToken?: string;

  @Column({ default: true })
  isConnected: boolean;

  @Column({ nullable: true })
  url?: string;
}
