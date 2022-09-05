import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaseDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  tenantId: string;
  @ApiProperty()
  listingId: string;
  @ApiProperty()
  startDate: string;
  @ApiProperty()
  endDate: string;
  @ApiProperty()
  comment: string;
  @ApiProperty()
  code: number;
  @ApiProperty()
  codeExpiry: Date;
  @ApiProperty()
  status: string;
}
