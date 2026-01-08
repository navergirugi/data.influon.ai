import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Gender } from '../../entities/enums';

export class UpdateUserInfoManualDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  // Advertiser specific
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  businessNumber?: string;
}
