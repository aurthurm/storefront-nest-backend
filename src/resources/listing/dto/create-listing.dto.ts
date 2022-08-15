import { ApiProperty } from '@nestjs/swagger';

export class CreateListingDto {
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
}
