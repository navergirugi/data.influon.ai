import { Controller, Post, Body, UseGuards, Get, Req, Ip, Headers } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminAuthGuard } from './admin-auth.guard';
import { CurrentAdmin } from './current-admin.decorator';
import { User } from '../../entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  async login(@Body() loginDto: AdminLoginDto, @Ip() ip: string) {
    return this.adminAuthService.login(loginDto, ip);
  }

  @Post('logout')
  @UseGuards(AdminAuthGuard)
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return this.adminAuthService.logout(token);
  }

  @Get('profile')
  @UseGuards(AdminAuthGuard)
  async getProfile(@CurrentAdmin() admin: User) {
    return this.adminAuthService.getProfile(admin);
  }

  @Post('change-password')
  @UseGuards(AdminAuthGuard)
  async changePassword(
    @CurrentAdmin() admin: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.adminAuthService.changePassword(admin, changePasswordDto);
  }
}
