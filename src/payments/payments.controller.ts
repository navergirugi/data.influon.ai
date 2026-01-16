import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AdminAuthGuard } from '../admin/auth/admin-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/enums';
import { PaymentStatus } from '../entities/payment.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin Payments')
@ApiBearerAuth('JWT-auth')
@Controller('admin/payments')
@UseGuards(AdminAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATOR)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: PaymentStatus,
  ) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    return this.paymentsService.findAll(pageNum, limitNum, status);
  }
}
