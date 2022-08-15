import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import {
  Subscription,
  SubscriptionDocument,
} from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    return await this.subscriptionModel.create(createSubscriptionDto);
  }

  async findAll(query = {}) {
    return await this.subscriptionModel.find(query);
  }

  async findOne(id: string) {
    return await this.subscriptionModel.findById(id);
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    return await this.subscriptionModel.findByIdAndUpdate(
      id,
      updateSubscriptionDto,
    );
  }

  async remove(id: string) {
    return await this.subscriptionModel.remove(id);
  }
}
