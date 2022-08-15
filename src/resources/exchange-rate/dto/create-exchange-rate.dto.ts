import { ApiProperty } from '@nestjs/swagger';

export class CreateExchangeRateDto {
  @ApiProperty()
  currency: string;

  @ApiProperty()
  base: boolean;

  @ApiProperty()
  rate: number;

  @ApiProperty()
  dateEffective: Date;
}
