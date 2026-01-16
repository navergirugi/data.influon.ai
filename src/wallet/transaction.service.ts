import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { Transaction } from '../entities/transaction.entity';
import { TransactionType } from '../entities/enums';
import { User } from '../entities/user.entity';

@Injectable()
export class TransactionService {
  async createTransaction(
    manager: EntityManager,
    wallet: Wallet,
    type: TransactionType,
    amount: number,
    finalBalance: number,
    currency: 'CASH' | 'POINT',
    description: string,
    relatedId?: string,
    adminUser?: User,
    expiresAt?: Date,
  ): Promise<Transaction> {
    const transaction = manager.create(Transaction, {
      wallet,
      type,
      amount,
      balanceAfter: finalBalance, // finalBalance -> balanceAfter
      currency,
      description,
      relatedId,
      adminUser,
      expiresAt,
    });
    return manager.save(transaction);
  }
}
