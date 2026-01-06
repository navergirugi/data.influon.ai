import { IsNumber, Min, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawPointDto {
  @ApiProperty({ description: 'Amount to withdraw', example: 10000 })
  @IsNumber()
  @Min(1000) // Minimum withdrawal amount
  amount: number;

  @ApiProperty({ description: 'Bank Name', example: 'Shinhan Bank' })
  @IsString()
  bankName: string;

  @ApiProperty({ description: 'Account Number', example: '110-123-456789' })
  @IsString()
  accountNumber: string;

  @ApiProperty({ description: 'Account Holder Name', example: 'John Doe' })
  @IsString()
  accountHolder: string;
}
