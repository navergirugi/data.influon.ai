import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DeviceType {
  ANDROID = 'android',
  IOS = 'ios',
}

export class SignInDto {
  @ApiProperty({ description: 'User Email', example: 'influencer@influon.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ description: 'Device Token for Push Notification', example: 'fcm_token_string' })
  @IsOptional()
  @IsString()
  deviceToken?: string;

  @ApiPropertyOptional({ description: 'Device Type', enum: DeviceType, example: 'android' })
  @IsOptional()
  @IsEnum(DeviceType)
  deviceType?: DeviceType;
}
