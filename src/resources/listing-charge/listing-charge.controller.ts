import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListingChargeService } from './listing-charge.service';
import { CreateListingChargeDto } from './dto/create-listing-charge.dto';
import { UpdateListingChargeDto } from './dto/update-listing-charge.dto';

@Controller('listing-charge')
export class ListingChargeController {
  constructor(private readonly listingChargeService: ListingChargeService) {}

  @Post()
  create(@Body() createListingChargeDto: CreateListingChargeDto) {
    return this.listingChargeService.create(createListingChargeDto);
  }

  @Get()
  findAll() {
    return this.listingChargeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingChargeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListingChargeDto: UpdateListingChargeDto) {
    return this.listingChargeService.update(+id, updateListingChargeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingChargeService.remove(+id);
  }
}
