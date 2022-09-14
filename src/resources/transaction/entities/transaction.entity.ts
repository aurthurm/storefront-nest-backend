import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Subscription } from 'src/resources/subscription/entities/subscription.entity';

export type TransactionDocument = Transaction & Document;

@Schema({
  timestamps: true,
})
export class Transaction {
  @Prop()
  amount: number;

  @Prop()
  transactionType: string;

  @Prop()
  description: string;

  @Prop()
  currency: string;

  @Prop()
  reference: string;

  @Prop()
  status: string;

  @Prop()
  user: string;

  @Prop({ type: Subscription })
  subscription: Subscription;

  @Prop({ type: Object })
  paynowResponse: any;

  @Prop({ type: Object })
  pollResults: any;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
