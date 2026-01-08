import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MyPageService } from './mypage.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckNicknameDto } from '../auth/dto/check-nickname.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { WithdrawPointDto } from './dto/withdraw-point.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entities/user.entity';

@ApiTags('MyPage')
@ApiBearerAuth('JWT-auth')
@Controller({
  path: 'mypage',
  version: '1',
})
export class MyPageController {
  constructor(private readonly myPageService: MyPageService) {}

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  async getMyPageData(@GetUser() user: User) {
    return this.myPageService.getMyPageData(user.id);
  }

  @Post('nickname-check')
  @ApiOperation({ summary: 'Check nickname availability' })
  async checkNickname(@Body() body: CheckNicknameDto) {
    return this.myPageService.checkNickname(body.nickname);
  }

  @Post('profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(@GetUser() user: User, @Body() body: UpdateProfileDto) {
    return this.myPageService.updateProfile(user.id, body);
  }

  @Get('point-history')
  @ApiOperation({ summary: 'Get point history' })
  async getPointHistory(@GetUser() user: User, @Query() query: any) {
    return this.myPageService.getPointHistory(user.id, query);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Request point withdrawal' })
  async withdrawPoint(@GetUser() user: User, @Body() body: WithdrawPointDto) {
    return this.myPageService.withdrawPoint(user.id, body);
  }
}
