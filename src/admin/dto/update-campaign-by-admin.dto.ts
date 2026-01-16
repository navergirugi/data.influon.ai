import { PartialType } from '@nestjs/swagger';
import { CreateCampaignByAdminDto } from './create-campaign-by-admin.dto';

export class UpdateCampaignByAdminDto extends PartialType(CreateCampaignByAdminDto) {}
