import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CampaignStatus } from '../../entities/enums';

export class UpdateCampaignStatusDto {
  @IsEnum(CampaignStatus)
  status: CampaignStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
