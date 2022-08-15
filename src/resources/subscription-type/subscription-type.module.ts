import { Module } from '@nestjs/common';
import { SubscriptionTypeService } from './subscription-type.service';
import { SubscriptionTypeController } from './subscription-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubscriptionType,
  SubscriptionTypeSchema,
} from './entities/subscription-type.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionType.name, schema: SubscriptionTypeSchema },
    ]),
  ],
  controllers: [SubscriptionTypeController],
  providers: [SubscriptionTypeService],
})
export class SubscriptionTypeModule {}
