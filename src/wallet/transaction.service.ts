import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Wallet } from '../entities/wallet.entity';
import { TransactionType } from '../entities/enums';
import { User } from '../entities/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(
    manager: EntityManager,
    wallet: Wallet,
    type: TransactionType,
    amount: number,
    balanceAfter: number,
    currency: 'CASH' | 'POINT',
    description?: string,
    relatedId?: string,
    adminUser?: User,
  ): Promise<Transaction> {
    const transaction = manager.create(Transaction, {
      wallet,
      type,
      amount,
      balanceAfter,
      currency,
      description,
      relatedId,
      adminUser,
    });
    return manager.save(transaction);
  }
}
