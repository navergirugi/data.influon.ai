import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [WalletModule],
  providers: [TasksService],
})
export class TasksModule {}
