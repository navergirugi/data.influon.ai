import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';
import { UserStatusHistory } from '../entities/user-status-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserStatusHistory])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
