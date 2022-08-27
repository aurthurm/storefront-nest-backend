import {
  CollectionProperties,
  Expose,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  pin: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  resetPinKey: string;

  @ApiProperty()
  requirePinChange: boolean;

  @ApiProperty()
  resetPasswordKey: string;

  @ApiProperty()
  requirePasswordChange: boolean;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  waBotPhone: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  middleName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastLogin: Date;

  @ApiProperty()
  lastPasswordReset: Date;

  @ApiProperty()
  roles: string[];

  @ApiProperty()
  status: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty({
    minimum: 1,
    maximum: 100,
  })
  completeness: number;

  @ApiProperty()
  botActive: boolean;

  @ApiProperty()
  eacNumber: string;
}

export class UserProperties extends CollectionProperties {
  @Expose({ name: 'createdAt', sortable: true })
  readonly createdAt: 'desc' | 'asc';

  @Expose({ sortable: true, default: true, filterable: true })
  readonly email: 'desc' | 'asc';

  @Expose({ sortable: true, default: true, filterable: true })
  readonly waBotPhone: 'desc' | 'asc';

  @Expose({ sortable: true, default: true, filterable: true })
  readonly firstName: 'desc' | 'asc';

  @Expose({ sortable: true, default: true, filterable: true })
  readonly lastName: 'desc' | 'asc';
}
