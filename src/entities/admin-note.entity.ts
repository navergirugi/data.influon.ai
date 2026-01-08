import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AdminNote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  targetUser: User;

  @ManyToOne(() => User)
  author: User; // Admin who wrote the note

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
