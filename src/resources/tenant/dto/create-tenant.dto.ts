import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  suburb: string;
  @ApiProperty()
  street: string;
  @ApiProperty()
  currentLease: string;
  @ApiProperty()
  status: string;
}
