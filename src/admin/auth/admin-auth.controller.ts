import { Controller, Post, Body, UseGuards, Get, Ip, Headers } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminAuthGuard } from './admin-auth.guard';
import { CurrentAdmin } from './current-admin.decorator';
import { User } from '../../entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/public.decorator';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: AdminLoginDto, @Ip() ip: string) {
    return this.adminAuthService.login(loginDto, ip);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminAuthGuard)
  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return this.adminAuthService.logout(token);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminAuthGuard)
  @Get('profile')
  async getProfile(@CurrentAdmin() admin: User) {
    return this.adminAuthService.getProfile(admin);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminAuthGuard)
  @Post('change-password')
  async changePassword(
    @CurrentAdmin() admin: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.adminAuthService.changePassword(admin, changePasswordDto);
  }
}
