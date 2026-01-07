import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PointStatus } from '../../entities/enums';

export class ProcessWithdrawalDto {
  @IsEnum([PointStatus.COMPLETED, PointStatus.CANCELED])
  status: PointStatus.COMPLETED | PointStatus.CANCELED;

  @IsOptional()
  @IsString()
  reason?: string; // Required if status is CANCELED
}
