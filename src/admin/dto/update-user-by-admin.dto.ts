import { IsEmail, IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { UserRole, UserStatus, Gender, BusinessStatus } from '../../entities/enums';
import { PartialType } from '@nestjs/swagger';
import { CreateUserByAdminDto } from './create-user-by-admin.dto';

// PartialType을 사용하여 CreateUserByAdminDto의 모든 필드를 선택적으로 만듭니다.
export class UpdateUserByAdminDto extends PartialType(CreateUserByAdminDto) {
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
