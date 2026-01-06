import { IsString, IsNumber, IsArray, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ParticipationType {
  PAID = '유상리뷰',
  FREE = '무상리뷰',
}

export class CreateApplicationDto {
  @ApiProperty({ description: 'Campaign ID', example: '1' })
  @IsString()
  campaignId: string;

  @ApiProperty({ description: 'Participation Type', enum: ParticipationType, example: '유상리뷰' })
  @IsEnum(ParticipationType)
  participationType: ParticipationType;

  @ApiProperty({ description: 'Reward Point (Required if paid review)', example: 50000 })
  @IsNumber()
  @Min(0)
  rewardPoint: number;

  @ApiProperty({ description: 'Visit Date Time (ISO 8601)', example: '2024-08-15T14:00' })
  @IsDateString()
  visitDateTime: string;

  @ApiProperty({ description: 'Agreed Terms List', example: ['term1', 'term2', 'term3'] })
  @IsArray()
  @IsString({ each: true })
  agreedTerms: string[];
}
