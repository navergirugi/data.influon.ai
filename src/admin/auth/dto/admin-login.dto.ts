import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ description: 'Admin Email', example: 'superadmin@influon.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Admin Password', example: 'admin1234' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
