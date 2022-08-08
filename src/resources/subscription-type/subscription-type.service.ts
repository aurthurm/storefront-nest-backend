import { Injectable } from '@nestjs/common';
import { CreateSubscriptionTypeDto } from './dto/create-subscription-type.dto';
import { UpdateSubscriptionTypeDto } from './dto/update-subscription-type.dto';

@Injectable()
export class SubscriptionTypeService {
  create(createSubscriptionTypeDto: CreateSubscriptionTypeDto) {
    return 'This action adds a new subscriptionType';
  }

  findAll() {
    return `This action returns all subscriptionType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriptionType`;
  }

  update(id: number, updateSubscriptionTypeDto: UpdateSubscriptionTypeDto) {
    return `This action updates a #${id} subscriptionType`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionType`;
  }
}
