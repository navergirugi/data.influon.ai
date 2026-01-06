import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckNicknameDto {
  @ApiProperty({ description: 'Nickname to check', example: 'influencer1' })
  @IsString()
  @MinLength(2)
  nickname: string;
}
