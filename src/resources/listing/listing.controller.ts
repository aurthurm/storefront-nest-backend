import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto, ListingProperties } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  CollectionResponse,
  ValidationPipe,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { ListingDocument } from './entities/listing.entity';

@Controller('listing')
@ApiTags('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  async create(@Body() createListingDto: CreateListingDto) {
    return {
      data: await this.listingService.create(createListingDto),
    };
  }

  @Post('/bulk')
  async bulkCreate(@Body() listings: CreateListingDto[]) {
    return {
      data: await this.listingService.bulkCreate(listings),
    };
  }

  @Get()
  findAll() {
    return this.listingService.findAll();
  }

  @Get('filter')
  filter(
    @Query(new ValidationPipe(ListingProperties)) collectionDto: any,
  ): Promise<CollectionResponse<ListingDocument>> {
    return this.listingService.filter(collectionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
    return this.listingService.update(id, updateListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingService.remove(id);
  }
}
