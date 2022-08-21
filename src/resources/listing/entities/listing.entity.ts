import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ListingDocument = Listing & Document;

@Schema({
  timestamps: true,
})
export class Listing {
  @Prop({})
  listingReference: string;

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

const _ListingSchema = SchemaFactory.createForClass(Listing);

_ListingSchema.index(
  { listingReference: 1, advertiserId: 1 },
  { unique: true },
);

export const ListingSchema = _ListingSchema;
