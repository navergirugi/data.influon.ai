import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { UserStatus } from './enums';

@Entity()
export class UserStatusHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  targetUser: User;

  @ManyToOne(() => User)
  changedBy: User; // Admin who changed the status

  @Column({ type: 'enum', enum: UserStatus })
  previousStatus: UserStatus;

  @Column({ type: 'enum', enum: UserStatus })
  newStatus: UserStatus;

  @Column({ nullable: true })
  reason?: string;

  @CreateDateColumn()
  createdAt: Date;
}
