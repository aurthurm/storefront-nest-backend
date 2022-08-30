import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LeaseDocument = Lease & Document;

@Schema({
  timestamps: true,
})
export class Lease {
  @Prop()
  userId: string;
  @Prop()
  tenantId: string;
  @Prop()
  listingId: string;
  @Prop()
  startDate: string;
  @Prop()
  endDate: string;
  @Prop()
  comment: string;
  @Prop()
  code: number;
}

export const LeaseSchema = SchemaFactory.createForClass(Lease);
