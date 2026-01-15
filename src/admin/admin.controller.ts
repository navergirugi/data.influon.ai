import { Controller, Patch, Param, Body, UseGuards, ParseUUIDPipe, Get, ParseIntPipe, Post, Query, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole, UserStatus } from '../entities/enums';
import { UpdateBusinessStatusDto } from './dto/update-business-status.dto';
import { AdminAuthGuard } from './auth/admin-auth.guard';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateCampaignStatusDto } from '../campaigns/dto/update-campaign-status.dto';
import { ProcessWithdrawalDto } from './dto/process-withdrawal.dto';
import { User } from '../entities/user.entity';
import { AdjustPointsDto } from './dto/adjust-points.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateUserManualDto } from './dto/create-user-manual.dto';
import { UpdateUserInfoManualDto } from './dto/update-user-info-manual.dto';
import { CreateAdminNoteDto } from './dto/create-admin-note.dto';
import { CurrentAdmin } from './auth/current-admin.decorator';
import { CreateCampaignByAdminDto } from './dto/create-campaign-by-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin')
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATOR)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // --- Admin Management (Super Admin Only) ---
  @Post('admins')
  @Roles(UserRole.SUPER_ADMIN)
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto);
  }

  @Get('admins')
  @Roles(UserRole.SUPER_ADMIN)
  getAdmins() {
    return this.adminService.getAdmins();
  }

  @Delete('admins/:id')
  @Roles(UserRole.SUPER_ADMIN)
  deleteAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteAdmin(id);
  }

  @Patch('admins/:id/role')
  @Roles(UserRole.SUPER_ADMIN)
  updateAdminRole(@Param('id', ParseUUIDPipe) id: string, @Body('role') role: UserRole) {
    return this.adminService.updateAdminRole(id, role);
  }

  // --- User Management ---
  @Delete('users/:id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteUser(id);
  }

  @Post('users')
  createUserByAdmin(@Body() dto: CreateUserByAdminDto) {
    return this.adminService.createUserByAdmin(dto);
  }

  @Patch('users/:id')
  updateUserByAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserByAdminDto,
  ) {
    return this.adminService.updateUserByAdmin(id, dto);
  }

  // --- User Management (Manual) ---
  @Post('users/manual')
  createUserManual(@CurrentAdmin() admin: User, @Body() dto: CreateUserManualDto) {
    return this.adminService.createUserManual(dto, admin);
  }

  @Patch('users/:id/info')
  updateUserInfoManual(
    @CurrentAdmin() admin: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserInfoManualDto,
  ) {
    return this.adminService.updateUserInfoManual(id, dto, admin);
  }

  @Patch('users/:id/status-history')
  updateUserStatusWithHistory(
    @CurrentAdmin() admin: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: UserStatus,
    @Body('reason') reason: string,
  ) {
    return this.adminService.updateUserStatusWithHistory(id, status, reason, admin);
  }

  // --- Admin Notes ---
  @Post('users/:id/notes')
  createAdminNote(
    @CurrentAdmin() admin: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateAdminNoteDto,
  ) {
    return this.adminService.createAdminNote(id, dto, admin);
  }

  @Get('users/:id/notes')
  getAdminNotes(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getAdminNotes(id);
  }

  // --- Dashboard & Stats ---
  @Get('dashboard/summary')
  getDashboardSummary() {
    return this.adminService.getDashboardSummary();
  }

  // 프론트엔드 호환용 대시보드 통계 API
  @Get('dashboard/stats')
  async getDashboardStats() {
    const summary = await this.adminService.getDashboardSummary() as any;
    // 프론트엔드 DashboardStats 인터페이스에 맞게 변환
    return {
      pendingAdvertisers: summary.pendingCounts.advertisers,
      pendingCampaigns: summary.pendingCounts.campaigns,
      pendingWithdrawals: summary.pendingCounts.withdrawals,
      totalRevenue: summary.cumulativeMetrics.totalPointsInSystem, // 일단 포인트 총액을 매출로 사용
      dailyActiveUsers: 0, // DAU는 아직 구현되지 않음
    };
  }

  @Get('dashboard/revenue')
  getRevenueStats(@Query('period') period: 'daily' | 'weekly' | 'monthly' = 'monthly') {
    return this.adminService.getRevenueStats(period);
  }

  @Get('dashboard/ranking/campaigns')
  getPopularCampaigns() {
    return this.adminService.getPopularCampaigns();
  }

  @Get('dashboard/ranking/influencers')
  getTopInfluencers() {
    return this.adminService.getTopInfluencers();
  }

  @Get('influencers')
  async getInfluencers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    // Query 파라미터가 문자열로 들어올 수 있으므로 형변환
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    
    const result = await this.adminService.getInfluencers(pageNum, limitNum, search, status);
    return result;
  }

  @Get('advertisers')
  async getAdvertisers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: UserStatus,
  ) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    
    const result = await this.adminService.getAdvertisers(pageNum, limitNum, search, status);
    return result;
  }

  // --- Points & Withdrawals ---
  @Post('users/:id/balance/adjust')
  adjustBalance(
    @CurrentAdmin() adminUser: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdjustPointsDto,
  ) {
    return this.adminService.adjustBalance(adminUser, id, dto);
  }

  @Get('points/withdrawals')
  getWithdrawalRequests() {
    return this.adminService.getWithdrawalRequests();
  }

  @Patch('points/withdrawals/:id')
  processWithdrawal(
    @CurrentAdmin() adminUser: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ProcessWithdrawalDto,
  ) {
    return this.adminService.processWithdrawal(adminUser, id, dto);
  }

  // --- Campaign Management ---
  @Post('campaigns/create-by-admin')
  createCampaignByAdmin(
    @CurrentAdmin() adminUser: User,
    @Body() dto: CreateCampaignByAdminDto,
  ) {
    return this.adminService.createCampaignByAdmin(dto, adminUser);
  }

  @Get('campaigns/pending')
  getPendingCampaigns() {
    return this.adminService.getPendingCampaigns();
  }

  @Patch('campaigns/:id/status')
  updateCampaignStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCampaignStatusDto,
  ) {
    return this.adminService.updateCampaignStatus(id, updateDto);
  }

  // --- Legacy User Management ---
  @Patch('users/:id/business-status')
  updateBusinessStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateBusinessStatusDto,
  ) {
    return this.adminService.updateBusinessStatus(id, updateDto);
  }

  @Patch('users/:id/status')
  updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, updateDto);
  }
}
