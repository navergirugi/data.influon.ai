import { Controller, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Delete('withdrawal')
  @ApiOperation({ summary: 'Withdraw user (Delete account)' })
  async withdrawUser() {
    // TODO: Get userId from AuthGuard
    const userId = 'dummy-user-id';
    return this.authService.withdrawUser(userId);
  }
}
