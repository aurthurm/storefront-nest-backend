import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ListingDocument = Listing & Document;

@Schema({
  timestamps: true,
})
export class Listing {
  @Prop()
  title: string;

  @Prop()
  gallery: string[];

  @Prop()
  descriptors: string[];

  @Prop()
  advertiserId: string;

  @Prop()
  price: number;

  @Prop()
  amenities: string[];

  @Prop()
  expirationDate: string;

  @Prop()
  priority: number;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  suburb: string;

  @Prop()
  street: string;

  @Prop()
  subscriptionId: string;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
