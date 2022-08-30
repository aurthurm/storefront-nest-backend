import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty()
  idNumber: string;
  @ApiProperty()
  passportNumber: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  gender: string;
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
