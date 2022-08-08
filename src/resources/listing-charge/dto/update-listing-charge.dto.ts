import { PartialType } from '@nestjs/mapped-types';
import { CreateListingChargeDto } from './create-listing-charge.dto';

export class UpdateListingChargeDto extends PartialType(CreateListingChargeDto) {}
