import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ExchangeRateDocument = ExchangeRate & Document;

@Schema({
  timestamps: true,
})
export class ExchangeRate {
  @Prop()
  currency: string;

  @Prop()
  base: boolean;

  @Prop()
  rate: number;

  @Prop()
  dateEffective: Date;
}
export const ExchangeRateSchema = SchemaFactory.createForClass(ExchangeRate);
