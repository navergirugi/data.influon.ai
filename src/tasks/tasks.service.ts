import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { WalletService } from '../wallet/wallet.service';
import { UserRole } from '../entities/enums';
import { User } from '../entities/user.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private dataSource: DataSource,
    private walletService: WalletService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredPoints() {
    this.logger.log('Running job to handle expired points...');

    const expiredTransactions = await this.dataSource
      .getRepository(Transaction)
      .createQueryBuilder('transaction')
      .where('transaction.expiresAt IS NOT NULL')
      .andWhere('transaction.expiresAt < NOW()')
      .andWhere('transaction.amount > 0') // 만료시킬 포인트가 있는 트랜잭션
      .getMany();

    for (const tx of expiredTransactions) {
      try {
        // 이미 만료 처리된 포인트는 건너뛰기 (중복 실행 방지 로직 필요)
        // 여기서는 간단히, 만료 트랜잭션에 대한 차감 트랜잭션이 있는지 확인
        const deductionExists = await this.dataSource.getRepository(Transaction).findOne({
          where: { relatedId: tx.id, description: 'Expired points' },
        });

        if (!deductionExists) {
          await this.walletService.adjustBalance(
            { id: 'admin-system', role: UserRole.ADMIN } as User,
            tx.wallet.user.id, // 이 부분은 wallet 엔티티에 user 관계가 있어야 함
            -tx.amount,
            'POINT',
            'Expired points',
          );
          this.logger.log(`Expired ${tx.amount} points for user ${tx.wallet.user.id}`);
        }
      } catch (error) {
        this.logger.error(`Failed to process expired points for transaction ${tx.id}`, error.stack);
      }
    }
    this.logger.log('Finished job to handle expired points.');
  }
}
