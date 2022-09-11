import {
  CollectionProperties,
  Expose,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty()
  subscriptionType: string;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  transactionId: string;
}

export class SubscriptionProperties extends CollectionProperties {
  @Expose({ name: 'subscriptionType', sortable: true })
  readonly subscriptionType: 'desc' | 'asc';

  @Expose({ name: 'userId', sortable: true, default: true, filterable: true })
  readonly userId: 'desc' | 'asc';
}
