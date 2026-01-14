import { Injectable, Logger, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceToken, DeviceType } from '../entities/device-token.entity';
import { Notification, NotificationType } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
// import * as admin from 'firebase-admin'; // 실제 사용 시 주석 해제

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(DeviceToken)
    private deviceTokenRepository: Repository<DeviceToken>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private configService: ConfigService,
  ) {
    this.initializeFirebase();
  }

  onModuleInit() {
    // 주기적 알림 스케줄러 시작 (예: 매일 오전 10시)
    this.startDailyNotificationScheduler();
  }

  private initializeFirebase() {
    // Firebase Admin SDK 초기화 로직
    // const serviceAccount = require(this.configService.get('FIREBASE_CREDENTIAL_PATH'));
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    // });
    this.logger.log('Firebase Admin Initialized (Mock Mode)');
  }

  private startDailyNotificationScheduler() {
    // 1분마다 체크하여 특정 시간에 알림 발송 (Mock 구현)
    setInterval(() => {
      const now = new Date();
      // 예: 매일 10시 00분에 전체 알림 발송
      if (now.getHours() === 10 && now.getMinutes() === 0) {
        this.sendDailyMarketingNotification();
      }
    }, 60000);
  }

  private async sendDailyMarketingNotification() {
    this.logger.log('Sending daily marketing notification...');
    // 전체 사용자에게 발송하는 로직 (배치 처리 필요)
  }

  // --- API Methods ---

  async getNotifications(user: User) {
    return this.notificationRepository.find({
      where: { userId: user.id }, // user 객체 대신 userId 사용 (성능 최적화)
      order: { createdAt: 'DESC' },
      take: 50, // 최근 50개만 조회
    });
  }

  async readNotification(user: User, id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async readAllNotifications(user: User) {
    await this.notificationRepository.update(
      { userId: user.id, isRead: false },
      { isRead: true },
    );
    return { success: true };
  }

  // --- Internal Methods ---

  // 디바이스 토큰 등록/갱신
  async registerToken(user: User, token: string, deviceType: DeviceType) {
    let deviceToken = await this.deviceTokenRepository.findOne({
      where: { token, userId: user.id },
    });

    if (deviceToken) {
      deviceToken.updatedAt = new Date();
      deviceToken.deviceType = deviceType;
    } else {
      deviceToken = this.deviceTokenRepository.create({
        user,
        token,
        deviceType,
        isActive: true,
      });
    }

    return this.deviceTokenRepository.save(deviceToken);
  }

  // 알림 발송 (단일 사용자)
  async sendNotification(
    user: User,
    title: string,
    body: string,
    type: NotificationType,
    data: Record<string, any> = {},
  ) {
    // 1. DB에 알림 이력 저장
    const log = this.notificationRepository.create({
      user,
      title,
      message: body,
      type,
      data: JSON.stringify(data),
    });
    await this.notificationRepository.save(log);

    // 2. 사용자의 활성화된 디바이스 토큰 조회
    const tokens = await this.deviceTokenRepository.find({
      where: { userId: user.id, isActive: true },
    });

    if (tokens.length === 0) {
      this.logger.warn(`No active device tokens for user ${user.id}`);
      return;
    }

    // 3. FCM 발송
    const fcmTokens = tokens.map((t) => t.token);
    const message = {
      notification: { title, body },
      data: { ...data, type },
      tokens: fcmTokens,
    };

    try {
      // const response = await admin.messaging().sendMulticast(message);
      // this.logger.log(`Successfully sent message: ${response.successCount} success, ${response.failureCount} failure`);
      this.logger.log(`[Mock FCM] Sending to ${user.email}: ${title} - ${body}`);
    } catch (error) {
      this.logger.error('Error sending message:', error);
    }
  }

  // --- 편의 메서드 ---

  // 캠페인 신청 완료 알림
  async notifyCampaignApplied(user: User, campaignTitle: string) {
    await this.sendNotification(
      user,
      '캠페인 신청 완료',
      `'${campaignTitle}' 캠페인에 신청되었습니다.`,
      NotificationType.CAMPAIGN_APPLY,
      { campaignTitle },
    );
  }

  // 캠페인 선정 알림
  async notifyCampaignSelected(user: User, campaignTitle: string) {
    await this.sendNotification(
      user,
      '캠페인 선정 축하!',
      `축하합니다! '${campaignTitle}' 캠페인에 선정되셨습니다.`,
      NotificationType.CAMPAIGN_SELECTED,
      { campaignTitle },
    );
  }

  // 캠페인 미선정 알림
  async notifyCampaignRejected(user: User, campaignTitle: string) {
    await this.sendNotification(
      user,
      '캠페인 선정 결과',
      `아쉽게도 '${campaignTitle}' 캠페인에 선정되지 않았습니다.`,
      NotificationType.CAMPAIGN_REJECTED,
      { campaignTitle },
    );
  }

  // 포인트 지급 알림
  async notifyPointPayment(user: User, amount: number, reason: string) {
    await this.sendNotification(
      user,
      '포인트 지급',
      `${amount.toLocaleString()}P가 지급되었습니다. (${reason})`,
      NotificationType.POINT_PAYMENT,
      { amount, reason },
    );
  }
}
