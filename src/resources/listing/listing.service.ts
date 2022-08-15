import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Listing, ListingDocument } from './entities/listing.entity';

@Injectable()
export class ListingService {
  constructor(
    @InjectModel(Listing.name) private accountModel: Model<ListingDocument>,
  ) {}

  async create(createListingDto: CreateListingDto) {
    return await this.accountModel.create(createListingDto);
  }

  async findAll(query = {}) {
    return await this.accountModel.find(query);
  }

  async findOne(id: string) {
    return await this.accountModel.findById(id);
  }

  async update(id: string, updateListingDto: UpdateListingDto) {
    return await this.accountModel.findByIdAndUpdate(id, updateListingDto);
  }

  async remove(id: string) {
    return await this.accountModel.remove(id);
  }
}
