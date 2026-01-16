import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { PointType, PointStatus } from './enums';

@Entity()
export class PointTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.pointTransactions)
  user: User;

  @Column({ type: 'enum', enum: PointType })
  type: PointType;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PointStatus })
  status: PointStatus;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'timestamp', nullable: true, comment: '포인트 만료 일시' })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
