import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { TransactionService } from './transaction.service';
import { TransactionType } from '../entities/enums';
import { User } from '../entities/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private transactionService: TransactionService,
    private dataSource: DataSource,
  ) {}

  async deposit(userId: string, amount: number, description: string): Promise<Wallet> {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await this.getWalletForUpdate(manager, userId);
      wallet.cashBalance += amount;
      await manager.save(wallet);

      await this.transactionService.createTransaction(
        manager,
        wallet,
        TransactionType.DEPOSIT,
        amount,
        wallet.cashBalance,
        'CASH',
        description,
      );
      return wallet;
    });
  }

  async lockForCampaign(userId: string, campaignId: string, amount: number): Promise<Wallet> {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await this.getWalletForUpdate(manager, userId);
      if (wallet.cashBalance < amount) {
        throw new BadRequestException('Insufficient cash balance.');
      }
      wallet.cashBalance -= amount;
      await manager.save(wallet);

      await this.transactionService.createTransaction(
        manager,
        wallet,
        TransactionType.CAMPAIGN_LOCK,
        -amount,
        wallet.cashBalance,
        'CASH',
        `Lock for campaign #${campaignId}`,
        campaignId,
      );
      return wallet;
    });
  }

  async payoutToInfluencer(advertiserId: string, influencerId: string, campaignId: string, amount: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      // No need to lock advertiser wallet as cash is already locked.
      // Payout is converting locked cash to influencer's points.
      const influencerWallet = await this.getWalletForUpdate(manager, influencerId);
      influencerWallet.pointBalance += amount;
      await manager.save(influencerWallet);

      await this.transactionService.createTransaction(
        manager,
        influencerWallet,
        TransactionType.CAMPAIGN_PAYOUT,
        amount,
        influencerWallet.pointBalance,
        'POINT',
        `Payout for campaign #${campaignId}`,
        campaignId,
      );
    });
  }

  async requestWithdrawal(userId: string, amount: number): Promise<Wallet> {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await this.getWalletForUpdate(manager, userId);
      if (wallet.pointBalance < amount) {
        throw new BadRequestException('Insufficient point balance.');
      }
      wallet.pointBalance -= amount;
      await manager.save(wallet);

      await this.transactionService.createTransaction(
        manager,
        wallet,
        TransactionType.WITHDRAWAL_REQUEST,
        -amount,
        wallet.pointBalance,
        'POINT',
        'Withdrawal request',
      );
      return wallet;
    });
  }

  async adjustBalance(adminUser: User, userId: string, amount: number, currency: 'CASH' | 'POINT', reason: string, expiresInDays?: number): Promise<Wallet> {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await this.getWalletForUpdate(manager, userId);
      if (currency === 'CASH') {
        wallet.cashBalance += amount;
      } else {
        wallet.pointBalance += amount;
      }
      await manager.save(wallet);

      let expiresAt: Date | undefined;
      if (expiresInDays && currency === 'POINT' && amount > 0) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);
      }

      await this.transactionService.createTransaction(
        manager,
        wallet,
        TransactionType.ADMIN_ADJUSTMENT,
        amount,
        currency === 'CASH' ? wallet.cashBalance : wallet.pointBalance,
        currency,
        `Admin adjustment: ${reason}`,
        null,
        adminUser,
        expiresAt,
      );
      return wallet;
    });
  }

  private async getWalletForUpdate(manager: EntityManager, userId: string): Promise<Wallet> {
    const wallet = await manager.findOne(Wallet, {
      where: { user: { id: userId } },
      lock: { mode: 'pessimistic_write' },
    });
    if (!wallet) {
      throw new NotFoundException(`Wallet for user ID "${userId}" not found.`);
    }
    return wallet;
  }
}
