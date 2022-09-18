import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import {
  Subscription,
  SubscriptionSchema,
} from './entities/subscription.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { WhatsappService } from 'src/providers/whatsapp/whatsapp.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, WhatsappService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
