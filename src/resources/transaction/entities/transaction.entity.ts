import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
  user: string;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
