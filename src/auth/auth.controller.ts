import { Controller, Post, Body, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { FindAccountDto } from './dto/find-account.dto';
import { CheckNicknameDto } from './dto/check-nickname.dto';
import { SendEmailCodeDto } from './dto/send-email-code.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'Sign in' })
  async signin(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up' })
  async signup(@Body() body: SignUpDto) {
    return this.authService.signup(body);
  }

  @Post('find-account')
  @ApiOperation({ summary: 'Find account (ID/Password)' })
  async findAccount(@Body() body: FindAccountDto) {
    return this.authService.findAccount(body);
  }

  @Post('check-nickname')
  @ApiOperation({ summary: 'Check nickname availability' })
  async checkNickname(@Body() body: CheckNicknameDto) {
    return this.authService.checkNickname(body.nickname);
  }

  @Post('send-email-code')
  @ApiOperation({ summary: 'Send email verification code' })
  async sendEmailCode(@Body() body: SendEmailCodeDto) {
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
