import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionTypeDto {
  @ApiProperty()
  price: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  active: boolean;
}
