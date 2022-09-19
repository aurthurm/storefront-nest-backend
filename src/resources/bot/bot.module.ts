import { Bot, BotSchema } from './entities/bot.entity';
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BotAccountService } from 'src/providers/bot-account/bot-account.service';
import { UserModule } from '../user/user.module';
import { SmsService } from 'src/providers/sms/sms.service';
import { HttpModule } from '@nestjs/axios';
import { ListingModule } from '../listing/listing.module';
import { TenantModule } from '../tenant/tenant.module';
import { LeaseModule } from '../lease/lease.module';
import { SubscriptionTypeModule } from '../subscription-type/subscription-type.module';
import { WhatsappService } from 'src/providers/whatsapp/whatsapp.service';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bot.name, schema: BotSchema }]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    UserModule,
    ListingModule,
    TenantModule,
    LeaseModule,
    SubscriptionTypeModule,
    TransactionModule,
  ],
  controllers: [BotController],
  providers: [BotService, BotAccountService, SmsService, WhatsappService],

  exports: [BotService],
})
export class BotModule {}
