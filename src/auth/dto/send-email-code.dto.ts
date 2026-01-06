import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailCodeDto {
  @ApiProperty({ description: 'Email to send verification code', example: 'user@example.com' })
  @IsEmail()
  email: string;
}
