import {
  CollectionProperties,
  Expose,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionTypeDto {
  @ApiProperty()
  price: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  days: number;

  @ApiProperty()
  userType: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  active: boolean;
}

export class SubscriptionTypeProperties extends CollectionProperties {
  @Expose({ name: 'title', sortable: true })
  readonly title: 'desc' | 'asc';

  @Expose({ name: 'userType', sortable: true, default: true, filterable: true })
  readonly userType: 'desc' | 'asc';
}
