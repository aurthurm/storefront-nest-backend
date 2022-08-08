import { Injectable } from '@nestjs/common';
import { CreateListingChargeDto } from './dto/create-listing-charge.dto';
import { UpdateListingChargeDto } from './dto/update-listing-charge.dto';

@Injectable()
export class ListingChargeService {
  create(createListingChargeDto: CreateListingChargeDto) {
    return 'This action adds a new listingCharge';
  }

  findAll() {
    return `This action returns all listingCharge`;
  }

  findOne(id: number) {
    return `This action returns a #${id} listingCharge`;
  }

  update(id: number, updateListingChargeDto: UpdateListingChargeDto) {
    return `This action updates a #${id} listingCharge`;
  }

  remove(id: number) {
    return `This action removes a #${id} listingCharge`;
  }
}
