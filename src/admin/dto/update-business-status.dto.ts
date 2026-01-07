import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BusinessStatus } from '../../entities/enums';

export class UpdateBusinessStatusDto {
  @IsEnum(BusinessStatus)
  businessStatus: BusinessStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
