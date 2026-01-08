import { IsString, IsDateString, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subTitle?: string;

  @IsString()
  shopName: string;

  @IsString()
  image: string;

  @IsString()
  platform: string;

  @IsString()
  category: string;

  @IsString()
  period: string;

  @IsDateString()
  announcementDate: Date;

  @IsDateString()
  reviewDeadline: Date;

  @IsBoolean()
  hasVideo: boolean;

  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @IsOptional()
  @IsString()
  serviceDetail?: string;

  @IsOptional()
  @IsString()
  missionGuide?: string;

  @IsOptional()
  @IsString()
  notice?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
