import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DeviceType } from '../../entities/device-token.entity';

export class RegisterTokenDto {
  @ApiProperty({ description: 'FCM Device Token' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ enum: DeviceType, description: 'Device Type (ANDROID, IOS, WEB)' })
  @IsEnum(DeviceType)
  deviceType: DeviceType;
}
