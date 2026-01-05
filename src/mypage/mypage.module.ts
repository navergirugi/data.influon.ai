import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyPageController } from './mypage.controller';
import { MyPageService } from './mypage.service';
import { User } from '../entities/user.entity';
import { PointTransaction } from '../entities/point-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PointTransaction])],
  controllers: [MyPageController],
  providers: [MyPageService],
})
export class MyPageModule {}
