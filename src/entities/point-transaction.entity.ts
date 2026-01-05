import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { PointType, PointStatus } from './enums';

@Entity()
export class PointTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.pointTransactions)
  user: User;

  @Column({ type: 'enum', enum: PointType, enumName: 'point_type_enum' })
  type: PointType;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: PointStatus, enumName: 'point_status_enum' })
  status: PointStatus;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;
}
