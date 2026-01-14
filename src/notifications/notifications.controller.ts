import { Controller, Post, Body, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entities/user.entity';
import { RegisterTokenDto } from './dto/register-token.dto';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('token')
  @ApiOperation({ summary: 'Register FCM device token' })
  async registerToken(@GetUser() user: User, @Body() body: RegisterTokenDto) {
    return this.notificationsService.registerToken(user, body.token, body.deviceType);
  }

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  async getNotifications(@GetUser() user: User) {
    return this.notificationsService.getNotifications(user);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async readNotification(@GetUser() user: User, @Param('id') id: string) {
    return this.notificationsService.readNotification(user, id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async readAllNotifications(@GetUser() user: User) {
    return this.notificationsService.readAllNotifications(user);
  }
}
