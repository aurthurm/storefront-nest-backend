import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({
  timestamps: true,
})
export class Subscription {
  @Prop()
  subscriptionType: string;
  @Prop()
  startDate: Date;
  @Prop()
  endDate: Date;
  @Prop()
  userId: string;
  @Prop()
  transactionId: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
