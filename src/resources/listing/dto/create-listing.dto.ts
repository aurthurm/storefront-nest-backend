import { ApiProperty } from '@nestjs/swagger';
import {
  CollectionProperties,
  Expose,
} from '@forlagshuset/nestjs-mongoose-paginate';

export class CreateListingDto {
  @ApiProperty()
  listingReference: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  gallery: string[];

  @ApiProperty()
  descriptors: string[];

  @ApiProperty()
  advertiserId: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  amenities: string[];

  @ApiProperty()
  expirationDate: string;

  @ApiProperty()
  priority: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  suburb: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  subscriptionId: string;

  @ApiProperty()
  leaseId: string;

  @ApiProperty()
  status: string;
}

export class ListingProperties extends CollectionProperties {
  @Expose({ name: 'createdAt', sortable: true })
  readonly createdAt: 'desc' | 'asc';

  @Expose({ sortable: true, default: true, filterable: true })
  readonly expirationDate: 'desc' | 'asc';

  @Expose({ sortable: true, default: true, filterable: true })
  readonly title: 'desc' | 'asc';
}
