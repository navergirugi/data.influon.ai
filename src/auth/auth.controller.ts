import { Controller, Post, Body, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'Sign in' })
  async signin(@Body() body: any) {
    return this.authService.signin(body);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up' })
  async signup(@Body() body: any) {
    return this.authService.signup(body);
  }

  @Post('find-account')
  @ApiOperation({ summary: 'Find account (ID/Password)' })
  async findAccount(@Body() body: any) {
    return this.authService.findAccount(body);
  }

  @Post('check-nickname')
  @ApiOperation({ summary: 'Check nickname availability' })
  async checkNickname(@Body() body: { nickname: string }) {
    return this.authService.checkNickname(body.nickname);
  }

  @Post('send-email-code')
  @ApiOperation({ summary: 'Send email verification code' })
  async sendEmailCode(@Body() body: { email: string }) {
    return this.authService.sendEmailCode(body.email);
  }

  @Delete('withdrawal')
  @ApiOperation({ summary: 'Withdraw user (Delete account)' })
  async withdrawUser() {
    // TODO: Get userId from AuthGuard
    const userId = 'dummy-user-id';
    return this.authService.withdrawUser(userId);
  }
}
