import { IsString, IsOptional, IsEmail, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Profile Image URL', example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsUrl()
  profileImage?: string;

  @ApiPropertyOptional({ description: 'Nickname', example: 'influencer1' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ description: 'Phone Number', example: '010-1234-5678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Introduction', example: 'Hello, I am an influencer.' })
  @IsOptional()
  @IsString()
  introduction?: string;

  // Add other fields as needed
}
