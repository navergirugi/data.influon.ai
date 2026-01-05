import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../entities/campaign.entity';
import { CampaignApplication } from '../entities/campaign-application.entity';
import { CampaignStatus, ApplicationStatus } from '../entities/enums';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(CampaignApplication)
    private applicationRepository: Repository<CampaignApplication>,
  ) {}

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

  async search(query: any) {
    // Basic search implementation
    const qb = this.campaignRepository.createQueryBuilder('campaign');

    if (query.category) {
      qb.andWhere('campaign.category = :category', { category: query.category });
    }
    
    if (query.platform) {
        qb.andWhere('campaign.platform = :platform', { platform: query.platform });
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

  async apply(body: any) {
    // body: { campaignId, participationType, rewardPoint, visitDateTime, agreedTerms }
    // TODO: Get userId from JWT (AuthGuard)
    // For now, using a dummy user ID or creating a dummy application
    
    // const application = this.applicationRepository.create({
    //     campaignId: body.campaignId,
    //     userId: 'dummy-user-id', // Needs Auth
    //     status: ApplicationStatus.APPLYING,
    //     participationType: body.participationType,
    //     rewardPoint: body.rewardPoint,
    //     // ... other fields
    // });
    // await this.applicationRepository.save(application);

    return {
      success: true,
      message: '캠페인 신청이 완료되었습니다.',
      data: null,
    };
  }
}
