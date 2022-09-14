import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  transactionType: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  reference: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  user: string;
}
