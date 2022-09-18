import {
  CollectionResponse,
  DocumentCollector,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WhatsappService } from 'src/providers/whatsapp/whatsapp.service';
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
    private whatsAppService: WhatsappService,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    return await this.subscriptionModel.create(createSubscriptionDto);
  }

  async findAll(query = {}, limit = null) {
    if (limit)
      return await this.subscriptionModel
        .find(query)
        .sort({
          createdAt: -1,
        })
        .limit(limit);
    return await this.subscriptionModel.find(query);
  }

  async filter(
    collectionDto: any,
  ): Promise<CollectionResponse<SubscriptionDocument>> {
    const collector = new DocumentCollector<SubscriptionDocument>(
      this.subscriptionModel,
    );
    return collector.find(collectionDto);
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
