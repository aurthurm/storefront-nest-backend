import {
  CollectionResponse,
  DocumentCollector,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Listing, ListingDocument } from './entities/listing.entity';

@Injectable()
export class ListingService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
  ) {}

  async create(createListingDto: CreateListingDto) {
    return await this.listingModel.create(createListingDto);
  }

  async bulkCreate(listings: CreateListingDto[]) {
    return await this.listingModel.create(listings);
  }

  async findAll(query = {}) {
    return await this.listingModel.find(query);
  }

  async filter(
    collectionDto: any,
  ): Promise<CollectionResponse<ListingDocument>> {
    const collector = new DocumentCollector<ListingDocument>(this.listingModel);
    return collector.find(collectionDto);
  }

  async findOne(id: string) {
    return await this.listingModel.findById(id);
  }

  async update(id: string, updateListingDto: UpdateListingDto) {
    return await this.listingModel.findByIdAndUpdate(id, updateListingDto);
  }

  async remove(id: string) {
    return await this.listingModel.remove(id);
  }

  async findOneAndDelete(payload = {}) {
    return await this.listingModel.findOneAndDelete(payload);
  }
}
