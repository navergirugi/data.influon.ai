import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAccountDto {
  @ApiProperty({ description: 'Name', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Phone Number', example: '010-1234-5678' })
  @IsString()
  phone: string;
}
