import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscriptionTypeService } from './subscription-type.service';
import { CreateSubscriptionTypeDto } from './dto/create-subscription-type.dto';
import { UpdateSubscriptionTypeDto } from './dto/update-subscription-type.dto';

@Controller('subscription-type')
export class SubscriptionTypeController {
  constructor(private readonly subscriptionTypeService: SubscriptionTypeService) {}

  @Post()
  create(@Body() createSubscriptionTypeDto: CreateSubscriptionTypeDto) {
    return this.subscriptionTypeService.create(createSubscriptionTypeDto);
  }

  @Get()
  findAll() {
    return this.subscriptionTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionTypeDto: UpdateSubscriptionTypeDto) {
    return this.subscriptionTypeService.update(+id, updateSubscriptionTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionTypeService.remove(+id);
  }
}
