import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchCampaignDto {
  @ApiPropertyOptional({ description: 'Category', example: '맛집' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'City', example: '서울' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Districts', example: ['강남구', '서초구'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  districts?: string[];

  @ApiPropertyOptional({ description: 'Channel', example: '인스타그램' })
  @IsOptional()
  @IsString()
  channel?: string;

  @ApiPropertyOptional({ description: 'Status', example: '진행중' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Sort option', example: '최신순' })
  @IsOptional()
  @IsString()
  sort?: string;
}
