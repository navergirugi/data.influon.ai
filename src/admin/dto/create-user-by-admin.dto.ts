import { IsEmail, IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { UserRole, UserStatus, Gender, BusinessStatus } from '../../entities/enums';

export class CreateUserByAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password?: string; // Admin이 생성할 때는 비밀번호도 설정 가능

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  birthYear?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  phone?: string;

  // Advertiser specific fields
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  businessNumber?: string;

  @IsOptional()
  @IsString()
  businessRegistration?: string;

  @IsOptional()
  @IsEnum(BusinessStatus)
  businessStatus?: BusinessStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  // Initial points (for admin creation)
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialPoints?: number;
}
