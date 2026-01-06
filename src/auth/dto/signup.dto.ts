import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  // TODO: Add more fields as per frontend requirements (e.g., birthYear, gender, etc.)
}
