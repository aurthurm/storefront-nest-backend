import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubscriptionTypeDto } from './dto/create-subscription-type.dto';
import { UpdateSubscriptionTypeDto } from './dto/update-subscription-type.dto';
import {
  SubscriptionType,
  SubscriptionTypeDocument,
} from './entities/subscription-type.entity';

@Injectable()
export class SubscriptionTypeService {
  constructor(
    @InjectModel(SubscriptionType.name)
    private subscriptionTypeModel: Model<SubscriptionTypeDocument>,
  ) {}

  async create(createSubscriptionTypeDto: CreateSubscriptionTypeDto) {
    return await this.subscriptionTypeModel.create(createSubscriptionTypeDto);
  }

  async findAll(query = {}) {
    return await this.subscriptionTypeModel.find(query);
  }

  async findOne(id: string) {
    return await this.subscriptionTypeModel.findById(id);
  }

  async update(
    id: string,
    updateSubscriptionTypeDto: UpdateSubscriptionTypeDto,
  ) {
    return await this.subscriptionTypeModel.findByIdAndUpdate(
      id,
      updateSubscriptionTypeDto,
    );
  }

  async remove(id: string) {
    return await this.subscriptionTypeModel.remove(id);
  }
}
