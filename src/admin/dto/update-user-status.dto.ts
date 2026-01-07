import { IsEnum } from 'class-validator';
import { UserStatus } from '../../entities/enums';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus;
}
