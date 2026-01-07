import { Injectable, NotFoundException, BadRequestException, Inject, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DataSource, In, Repository } from 'typeorm';
import { UpdateBusinessStatusDto } from './dto/update-business-status.dto';
import { BusinessStatus, CampaignStatus, PointType, PointStatus, AdminActionType, UserRole, UserStatus } from '../entities/enums';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { Campaign } from '../entities/campaign.entity';
import { PointTransaction } from '../entities/point-transaction.entity';
import { AdminAuditLog } from '../entities/admin-audit-log.entity';
import { ProcessWithdrawalDto } from './dto/process-withdrawal.dto';
import { AdjustPointsDto } from './dto/adjust-points.dto';
import { CampaignsService } from '../campaigns/campaigns.service';
import { UpdateCampaignStatusDto } from '../campaigns/dto/update-campaign-status.dto';
import { UsersService } from '../users/users.service';
import { calculateWithdrawalAmount } from '../common/utils/tax.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserManualDto } from './dto/create-user-manual.dto';
import { UpdateUserInfoManualDto } from './dto/update-user-info-manual.dto';
import { AdminNote } from '../entities/admin-note.entity';
import { CreateAdminNoteDto } from './dto/create-admin-note.dto';
import { CreateCampaignByAdminDto } from './dto/create-campaign-by-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private dataSource: DataSource,
    private readonly campaignsService: CampaignsService,
    private readonly usersService: UsersService,
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,
    @InjectRepository(AdminAuditLog)
    private readonly auditLogRepository: Repository<AdminAuditLog>,
    @InjectRepository(AdminNote)
    private readonly adminNoteRepository: Repository<AdminNote>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Admin Management
  async createAdmin(dto: CreateAdminDto): Promise<User> {
    const { email, password, ...rest } = dto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = this.userRepository.create({
      email,
      password: hashedPassword,
      ...rest,
      status: UserStatus.ACTIVE,
    });

    return this.userRepository.save(admin);
  }

  async getAdmins(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: In([UserRole.SUPER_ADMIN, UserRole.OPERATOR, UserRole.ADMIN]) },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteAdmin(id: string): Promise<void> {
    const admin = await this.userRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID "${id}" not found`);
    }
    await this.userRepository.softDelete(id);
  }

  async updateAdminRole(id: string, role: UserRole): Promise<User> {
    const admin = await this.userRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID "${id}" not found`);
    }
    admin.role = role;
    return this.userRepository.save(admin);
  }

  // User Management (Manual)
  async createUserManual(dto: CreateUserManualDto, adminUser: User): Promise<User> {
    const user = await this.usersService.createUserManual(dto);
    
    const log = new AdminAuditLog();
    log.adminUser = adminUser;
    log.targetUser = user;
    log.action = AdminActionType.CREATE_USER;
    log.reason = 'Manual creation by admin';
    await this.auditLogRepository.save(log);

    return user;
  }

  async updateUserInfoManual(userId: string, dto: UpdateUserInfoManualDto, adminUser: User): Promise<User> {
    const user = await this.usersService.updateUserInfoManual(userId, dto);

    const log = new AdminAuditLog();
    log.adminUser = adminUser;
    log.targetUser = user;
    log.action = AdminActionType.UPDATE_USER_INFO;
    log.reason = 'Manual update by admin';
    log.details = dto;
    await this.auditLogRepository.save(log);

    return user;
  }

  async updateUserStatusWithHistory(userId: string, status: UserStatus, reason: string, adminUser: User): Promise<User> {
    const user = await this.usersService.updateUserStatusWithHistory(userId, status, reason, adminUser);
    
    const log = new AdminAuditLog();
    log.adminUser = adminUser;
    log.targetUser = user;
    log.action = AdminActionType.UPDATE_USER_STATUS;
    log.reason = reason;
    log.details = { newStatus: status };
    await this.auditLogRepository.save(log);

    return user;
  }

  // Admin Notes
  async createAdminNote(userId: string, dto: CreateAdminNoteDto, adminUser: User): Promise<AdminNote> {
    const targetUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!targetUser) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const note = this.adminNoteRepository.create({
      targetUser,
      author: adminUser,
      content: dto.content,
    });

    return this.adminNoteRepository.save(note);
  }

  async getAdminNotes(userId: string): Promise<AdminNote[]> {
    return this.adminNoteRepository.find({
      where: { targetUser: { id: userId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  // Campaign Management (Admin)
  async createCampaignByAdmin(dto: CreateCampaignByAdminDto, adminUser: User): Promise<Campaign> {
    const { targetAdvertiserId, autoApprove, forceCreate, ...campaignData } = dto;

    const advertiser = await this.userRepository.findOne({ where: { id: targetAdvertiserId, role: UserRole.ADVERTISER } });
    if (!advertiser) {
      throw new NotFoundException(`Advertiser with ID "${targetAdvertiserId}" not found`);
    }

    if (advertiser.status !== UserStatus.ACTIVE || advertiser.businessStatus !== BusinessStatus.APPROVED) {
      throw new BadRequestException('Advertiser is not active or approved.');
    }

    // Point Check & Deduction Logic (Simplified for now)
    if (!forceCreate && advertiser.points < 0) {
        throw new BadRequestException('Insufficient points.');
    }

    const campaign = await this.campaignsService.create(campaignData, advertiser, adminUser, autoApprove);

    // Log action
    const log = new AdminAuditLog();
    log.adminUser = adminUser;
    log.targetUser = advertiser;
    log.targetCampaign = campaign;
    log.action = AdminActionType.CREATE_CAMPAIGN_BY_ADMIN;
    log.reason = 'Campaign created by admin';
    log.details = { autoApprove, forceCreate };
    await this.auditLogRepository.save(log);

    return campaign;
  }

  // ... existing methods ...
  async getPopularCampaigns(limit: number = 5) {
    const cacheKey = `popular_campaigns_${limit}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const query = `
      SELECT c.id, c.title, c."shopName", c.status, c."createdAt", COUNT(ca.id) as "applicationCount"
      FROM campaign c
      LEFT JOIN campaign_application ca ON c.id = ca."campaignId"
      GROUP BY c.id
      ORDER BY "applicationCount" DESC
      LIMIT $1
    `;
    
    const result = await this.dataSource.query(query, [limit]);
    await this.cacheManager.set(cacheKey, result, 300000); // 5 minutes
    return result;
  }

  async getTopInfluencers(limit: number = 5) {
    const cacheKey = `top_influencers_${limit}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const query = `
      SELECT u.id, u.nickname, u.name, u.email, u."profileImage", COALESCE(SUM(pt.amount), 0) as "totalEarned"
      FROM "user" u
      LEFT JOIN point_transaction pt ON u.id = pt."userId" AND pt.type = '${PointType.EARN}' AND pt.status = '${PointStatus.COMPLETED}'
      WHERE u.role = '${UserRole.INFLUENCER}'
      GROUP BY u.id
      ORDER BY "totalEarned" DESC NULLS LAST
      LIMIT $1
    `;

    const result = await this.dataSource.query(query, [limit]);
    await this.cacheManager.set(cacheKey, result, 300000); // 5 minutes
    return result;
  }

  async getRevenueStats(period: 'daily' | 'weekly' | 'monthly') {
    const cacheKey = `revenue_stats_${period}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    let dateFormat: string;
    if (period === 'daily') {
      dateFormat = 'YYYY-MM-DD';
    } else if (period === 'weekly') {
      dateFormat = 'IYYY-IW';
    } else {
      dateFormat = 'YYYY-MM';
    }

    const query = `
      WITH revenue AS (
        SELECT TO_CHAR("createdAt", '${dateFormat}') as date, SUM(amount) as total_revenue
        FROM point_transaction
        WHERE type = '${PointType.PAYMENT}' AND status = '${PointStatus.COMPLETED}'
        GROUP BY date
      ),
      expense AS (
        SELECT TO_CHAR("createdAt", '${dateFormat}') as date, SUM(amount) as total_expense
        FROM point_transaction
        WHERE type = '${PointType.WITHDRAW}' AND status = '${PointStatus.COMPLETED}'
        GROUP BY date
      )
      SELECT 
        COALESCE(r.date, e.date) as date,
        COALESCE(r.total_revenue, 0) as revenue,
        COALESCE(e.total_expense, 0) as expense,
        (COALESCE(r.total_revenue, 0) - COALESCE(e.total_expense, 0)) as profit
      FROM revenue r
      FULL OUTER JOIN expense e ON r.date = e.date
      ORDER BY date ASC
    `;

    const result = await this.dataSource.query(query);
    await this.cacheManager.set(cacheKey, result, 300000); // 5 minutes
    return result;
  }

  async getDashboardSummary() {
    const cacheKey = 'dashboard_summary';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const query = `
      SELECT
        (SELECT COUNT(*) FROM "user" WHERE role = '${UserRole.ADVERTISER}' AND "businessStatus" = '${BusinessStatus.PENDING}') as "pendingAdvertisers",
        (SELECT COUNT(*) FROM campaign WHERE status = '${CampaignStatus.PENDING_APPROVAL}') as "pendingCampaigns",
        (SELECT COUNT(*) FROM point_transaction WHERE type = '${PointType.WITHDRAW}' AND status = '${PointStatus.PROCESSING}') as "pendingWithdrawals",
        (SELECT COUNT(*) FROM "user" WHERE role = '${UserRole.INFLUENCER}') as "totalInfluencers",
        (SELECT COUNT(*) FROM "user" WHERE role = '${UserRole.ADVERTISER}') as "totalAdvertisers",
        (SELECT COUNT(*) FROM campaign WHERE status IN ('${CampaignStatus.RECRUITING}', '${CampaignStatus.IN_PROGRESS}', '${CampaignStatus.REVIEWING}')) as "activeCampaigns",
        (SELECT COALESCE(SUM(points), 0) FROM "user") as "totalPoints"
    `;

    const result = await this.dataSource.query(query);
    const data = result[0];

    const response = {
      pendingCounts: {
        advertisers: parseInt(data.pendingAdvertisers),
        campaigns: parseInt(data.pendingCampaigns),
        withdrawals: parseInt(data.pendingWithdrawals),
      },
      cumulativeMetrics: {
        totalUsers: parseInt(data.totalInfluencers) + parseInt(data.totalAdvertisers),
        totalInfluencers: parseInt(data.totalInfluencers),
        totalAdvertisers: parseInt(data.totalAdvertisers),
        activeCampaigns: parseInt(data.activeCampaigns),
        totalPointsInSystem: parseInt(data.totalPoints),
      },
    };

    await this.cacheManager.set(cacheKey, response, 300000); // 5 minutes
    return response;
  }

  async getPendingCampaigns(): Promise<Campaign[]> {
    return this.campaignsService.getPending();
  }

  async updateCampaignStatus(campaignId: number, updateDto: UpdateCampaignStatusDto): Promise<Campaign> {
    return this.campaignsService.updateStatus(campaignId, updateDto);
  }

  async updateBusinessStatus(userId: string, updateDto: UpdateBusinessStatusDto): Promise<User> {
    return this.usersService.updateBusinessStatus(userId, updateDto);
  }

  async updateUserStatus(userId: string, updateDto: UpdateUserStatusDto): Promise<User> {
    return this.usersService.updateUserStatus(userId, updateDto);
  }

  async adjustPoints(adminUser: User, targetUserId: string, dto: AdjustPointsDto): Promise<User> {
    const { amount, reason } = dto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const targetUser = await queryRunner.manager.findOne(User, { where: { id: targetUserId } });
      if (!targetUser) {
        throw new NotFoundException(`User with ID "${targetUserId}" not found.`);
      }

      const originalPoints = targetUser.points;
      targetUser.points += amount;

      if (targetUser.points < 0) {
        throw new BadRequestException('User points cannot be negative.');
      }

      const pointTx = new PointTransaction();
      pointTx.user = targetUser;
      pointTx.amount = amount;
      pointTx.type = amount > 0 ? PointType.EARN : PointType.WITHDRAW;
      pointTx.status = PointStatus.COMPLETED;
      pointTx.description = `관리자 조정: ${reason}`;

      const log = new AdminAuditLog();
      log.adminUser = adminUser;
      log.targetUser = targetUser;
      log.action = AdminActionType.ADJUST_POINTS;
      log.reason = reason;
      log.details = {
        targetUserId,
        amount,
        originalPoints,
        newPoints: targetUser.points,
      };

      await queryRunner.manager.save(targetUser);
      await queryRunner.manager.save(pointTx);
      await queryRunner.manager.save(log);

      await queryRunner.commitTransaction();
      return targetUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getWithdrawalRequests(): Promise<PointTransaction[]> {
    return this.pointTransactionRepository.find({
      where: {
        type: PointType.WITHDRAW,
        status: PointStatus.PROCESSING,
      },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async processWithdrawal(adminUser: User, transactionId: string, dto: ProcessWithdrawalDto): Promise<PointTransaction> {
    const { status, reason } = dto;

    if (status === PointStatus.CANCELED && !reason) {
      throw new BadRequestException('Reason is required for cancellation.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.findOne(PointTransaction, {
        where: { id: transactionId, type: PointType.WITHDRAW, status: PointStatus.PROCESSING },
        relations: ['user'],
      });

      if (!transaction) {
        throw new NotFoundException(`Withdrawal request with ID "${transactionId}" not found or already processed.`);
      }

      const targetUser = transaction.user;
      transaction.status = status;

      const log = new AdminAuditLog();
      log.adminUser = adminUser;
      log.targetUser = targetUser;
      log.reason = reason || 'Withdrawal processed';
      log.details = { transactionId, newStatus: status };

      if (status === PointStatus.COMPLETED) {
        if (targetUser.points < transaction.amount) {
          throw new BadRequestException('Insufficient points for withdrawal.');
        }
        
        // Calculate tax and actual amount
        const { tax, actualAmount } = calculateWithdrawalAmount(transaction.amount);
        log.details = { 
          ...log.details,
          withdrawalAmount: transaction.amount,
          tax,
          actualAmount 
        };

        targetUser.points -= transaction.amount;
        log.action = AdminActionType.APPROVE_WITHDRAWAL;
        await queryRunner.manager.save(targetUser);
      } else { // CANCELED
        log.action = AdminActionType.REJECT_WITHDRAWAL;
      }

      await queryRunner.manager.save(transaction);
      await queryRunner.manager.save(log);

      await queryRunner.commitTransaction();
      return transaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getStats() {
    const userRepository = this.dataSource.getRepository(User);
    const totalAdvertisers = await userRepository.count({ where: { role: UserRole.ADVERTISER } });
    const totalInfluencers = await userRepository.count({ where: { role: UserRole.INFLUENCER } });
    const pendingAdvertisers = await userRepository.count({
      where: { role: UserRole.ADVERTISER, businessStatus: BusinessStatus.PENDING },
    });

    return {
      totalAdvertisers,
      totalInfluencers,
      pendingAdvertisers,
    };
  }
}
