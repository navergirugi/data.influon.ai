import { IsInt, IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class AdjustPointsDto {
  @IsInt()
  amount: number;

  @IsEnum(['CASH', 'POINT'])
  currency: 'CASH' | 'POINT';

  @IsString()
  @IsNotEmpty()
  reason: string;
}
