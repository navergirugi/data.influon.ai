import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../entities/campaign.entity';
import { CampaignApplication } from '../entities/campaign-application.entity';
import { CampaignStatus, ApplicationStatus, UserRole, Platform } from '../entities/enums';
import { SearchCampaignDto } from './dto/search-campaign.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(CampaignApplication)
    private applicationRepository: Repository<CampaignApplication>,
  ) {}

  private convertPlatformToEnum(platform: string): Platform {
    const platformMap = {
      '인스타그램': Platform.INSTAGRAM,
      '유튜브': Platform.YOUTUBE,
      '블로그': Platform.BLOG,
      '틱톡': Platform.TIKTOK,
      '트위터': Platform.TWITTER,
      '페이스북': Platform.FACEBOOK,
    };
    const enumValue = platformMap[platform] || Platform[platform.toUpperCase() as keyof typeof Platform];
    if (!enumValue) {
      throw new BadRequestException(`Invalid platform: ${platform}`);
    }
    return enumValue;
  }

  private convertStatusToEnum(status: string): CampaignStatus {
    const statusMap = {
      '모집중': CampaignStatus.RECRUITING,
      '진행중': CampaignStatus.IN_PROGRESS,
      '리뷰중': CampaignStatus.REVIEWING,
      '종료': CampaignStatus.ENDED,
      '예정': CampaignStatus.UPCOMING,
    };
    const enumValue = statusMap[status] || CampaignStatus[status.toUpperCase() as keyof typeof CampaignStatus];
    if (!enumValue) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }
    return enumValue;
  }

  async apply(user: User, body: CreateApplicationDto): Promise<CampaignApplication> {
    const { campaignId, ...rest } = body;

    if (user.role !== UserRole.INFLUENCER) {
      throw new BadRequestException('Only influencers can apply for campaigns.');
    }

    const campaign = await this.campaignRepository.findOne({ where: { id: +campaignId } });
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found.`);
    }

    const existingApplication = await this.applicationRepository.findOne({
      where: { campaign: { id: +campaignId }, user: { id: user.id } },
    });

    if (existingApplication) {
      throw new ConflictException('You have already applied for this campaign.');
    }

    const application = this.applicationRepository.create({
      ...rest,
      campaign,
      user,
      status: ApplicationStatus.APPLYING,
    });

    return this.applicationRepository.save(application);
  }

  async create(
    dto: CreateCampaignDto,
    advertiser: User,
    createdByAdmin?: User,
    autoApprove: boolean = false,
  ): Promise<Campaign> {
    const platformEnum = this.convertPlatformToEnum(dto.platform);

    const campaign = this.campaignRepository.create({
      ...dto,
      platform: platformEnum,
      advertiser,
      createdByAdmin,
      status: autoApprove ? CampaignStatus.RECRUITING : CampaignStatus.PENDING_APPROVAL,
    });

    return this.campaignRepository.save(campaign);
  }

  async getPending(): Promise<Campaign[]> {
    return this.campaignRepository.find({
      where: { status: CampaignStatus.PENDING_APPROVAL },
      order: { createdAt: 'ASC' },
    });
  }

  async updateStatus(id: number, updateDto: UpdateCampaignStatusDto): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({ where: { id } });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID "${id}" not found`);
    }

    const { status, rejectionReason } = updateDto;

    if (status === CampaignStatus.REJECTED && !rejectionReason) {
      throw new BadRequestException('Rejection reason is required when rejecting a campaign.');
    }

    campaign.status = status;
    if (status === CampaignStatus.REJECTED) {
      campaign.rejectionReason = rejectionReason;
    } else {
      campaign.rejectionReason = null;
    }
    
    if (status === CampaignStatus.APPROVED) {
      campaign.status = CampaignStatus.RECRUITING;
    }

    return this.campaignRepository.save(campaign);
  }

  async getMainList() {
    // TODO: Implement actual logic for "Today Open" and "Nearby"
    // For now, just fetching some campaigns to return structure
    
    const todayOpen = await this.campaignRepository.find({
      where: { status: CampaignStatus.TODAY_OPEN },
      take: 5,
      order: { createdAt: 'DESC' }
    });

    // Nearby logic requires user location, for now returning random or latest
    const nearby = await this.campaignRepository.find({
      take: 5,
      order: { id: 'DESC' }
    });

    return {
      success: true,
      data: {
        todayOpen,
        nearby,
      },
    };
  }

  async search(query: SearchCampaignDto) {
    // Basic search implementation
    const qb = this.campaignRepository.createQueryBuilder('campaign');

    if (query.category && query.category !== '전체') {
      qb.andWhere('campaign.category = :category', { category: query.category });
    }
    
    if (query.channel && query.channel !== '전체') {
        const platformEnum = this.convertPlatformToEnum(query.channel);
        qb.andWhere('campaign.platform = :platform', { platform: platformEnum });
    }

    if (query.status && query.status !== '전체') {
        const statusEnum = this.convertStatusToEnum(query.status);
        qb.andWhere('campaign.status = :status', { status: statusEnum });
    }

    // TODO: Implement city/district filter logic (requires DB schema support for address parsing or separate columns)
    // if (query.city) { ... }

    // TODO: Implement sorting
    if (query.sort === '최신순') {
        qb.orderBy('campaign.createdAt', 'DESC');
    } else if (query.sort === '마감임박순') {
        qb.orderBy('campaign.reviewDeadline', 'ASC');
    }

    const campaigns = await qb.getMany();

    return {
      success: true,
      data: campaigns,
    };
  }

  async getDetail(id: number) {
    const campaign = await this.campaignRepository.findOne({ where: { id } });
    
    if (!campaign) {
        throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    // Add mock detail fields if they are null in DB (for development)
    // In real app, these should be in DB
    const detail = {
        ...campaign,
        // Mocking location if missing
        location: { lat: campaign.lat || 37.5, lng: campaign.lng || 127.0 },
        operatingInfo: {
            offDays: campaign.offDays || '연중무휴',
            breakTime: campaign.breakTime || '없음',
            availableTime: campaign.availableTime || '10:00~22:00',
        }
    };

    return {
      success: true,
      data: detail,
    };
  }
}
