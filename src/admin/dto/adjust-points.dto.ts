import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AdjustPointsDto {
  @IsInt()
  amount: number; // Positive for adding, negative for subtracting

  @IsString()
  @IsNotEmpty()
  reason: string;
}
