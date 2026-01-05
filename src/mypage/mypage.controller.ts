import { Controller, Get, Post, Body, Query, Delete } from '@nestjs/common';
import { MyPageService } from './mypage.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('MyPage')
@Controller('v1/mypage')
export class MyPageController {
  constructor(private readonly myPageService: MyPageService) {}

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  async getMyPageData() {
    // TODO: Get userId from AuthGuard
    const userId = 'dummy-user-id'; 
    return this.myPageService.getMyPageData(userId);
  }

  @Post('nickname-check')
  @ApiOperation({ summary: 'Check nickname availability' })
  async checkNickname(@Body('nickname') nickname: string) {
    return this.myPageService.checkNickname(nickname);
  }

  @Post('profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(@Body() body: any) {
    // TODO: Get userId from AuthGuard
    const userId = 'dummy-user-id';
    return this.myPageService.updateProfile(userId, body);
  }

  @Get('point-history')
  @ApiOperation({ summary: 'Get point history' })
  async getPointHistory(@Query() query: any) {
    // TODO: Get userId from AuthGuard
    const userId = 'dummy-user-id';
    return this.myPageService.getPointHistory(userId, query);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Request point withdrawal' })
  async withdrawPoint(@Body() body: any) {
    // TODO: Get userId from AuthGuard
    const userId = 'dummy-user-id';
    return this.myPageService.withdrawPoint(userId, body);
  }
}
