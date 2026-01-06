import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DeviceType {
  ANDROID = 'android',
  IOS = 'ios',
}

export class SignUpDto {
  @ApiProperty({ description: 'User Email', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'User Name', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Nickname', example: 'influencer1' })
  @IsString()
  nickname: string;

  @ApiProperty({ description: 'Phone Number', example: '010-1234-5678' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: 'Device Token for Push Notification', example: 'fcm_token_string' })
  @IsOptional()
  @IsString()
  deviceToken?: string;

  @ApiPropertyOptional({ description: 'Device Type', enum: DeviceType, example: 'android' })
  @IsOptional()
  @IsEnum(DeviceType)
  deviceType?: DeviceType;
}
