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
import { SubscriptionService } from './subscription.service';
import {
  CreateSubscriptionDto,
  SubscriptionProperties,
} from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  CollectionResponse,
  ValidationPipe,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { SubscriptionDocument } from './entities/subscription.entity';

@Controller('subscription')
@ApiTags('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    console.log(createSubscriptionDto);
    return {
      data: await this.subscriptionService.create(createSubscriptionDto),
    };
  }

  @Get()
  async findAll() {
    return {
      data: await this.subscriptionService.findAll(),
    };
  }

  @Get('filter')
  async filter(
    @Query(new ValidationPipe(SubscriptionProperties)) collectionDto: any,
  ): Promise<CollectionResponse<SubscriptionDocument>> {
    return await this.subscriptionService.filter(collectionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      data: this.subscriptionService.findOne(id),
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return { data: this.subscriptionService.update(id, updateSubscriptionDto) };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return {
      data: this.subscriptionService.remove(id),
    };
  }
}
