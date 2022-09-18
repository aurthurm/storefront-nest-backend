import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/resources/user/entities/user.entity';
import * as mongoose from 'mongoose';
import { SubscriptionType } from 'src/resources/subscription-type/entities/subscription-type.entity';

export type SubscriptionDocument = Subscription & Document;

@Schema({
  timestamps: true,
})
export class Subscription {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: SubscriptionType.name })
  subscriptionType: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: string;

  @Prop()
  transactionId: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
