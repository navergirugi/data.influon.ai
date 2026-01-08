import { IsUUID, IsBoolean, IsOptional } from 'class-validator';
import { CreateCampaignDto } from '../../campaigns/dto/create-campaign.dto';

export class CreateCampaignByAdminDto extends CreateCampaignDto {
  @IsUUID()
  targetAdvertiserId: string;

  @IsOptional()
  @IsBoolean()
  autoApprove?: boolean;

  @IsOptional()
  @IsBoolean()
  forceCreate?: boolean; // Ignore point check
}
