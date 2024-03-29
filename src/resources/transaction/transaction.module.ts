import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { PaynowService } from 'src/providers/paynow/paynow/paynow.service';
import { HttpModule } from '@nestjs/axios';
import { SubscriptionModule } from '../subscription/subscription.module';
import { WhatsappService } from 'src/providers/whatsapp/whatsapp.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    SubscriptionModule,
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, PaynowService, WhatsappService],
  exports: [TransactionService],
})
export class TransactionModule {}
