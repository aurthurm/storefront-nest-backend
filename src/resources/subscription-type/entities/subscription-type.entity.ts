import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SubscriptionTypeDocument = SubscriptionType & Document;

@Schema({
  timestamps: true,
})
export class SubscriptionType {
  @Prop()
  price: number;

  @Prop()
  title: string;

  @Prop()
  userType: string;

  @Prop()
  description: string;

  @Prop()
  active: boolean;
}
export const SubscriptionTypeSchema =
  SchemaFactory.createForClass(SubscriptionType);
