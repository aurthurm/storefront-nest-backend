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
import { SubscriptionTypeService } from './subscription-type.service';
import {
  CreateSubscriptionTypeDto,
  SubscriptionTypeProperties,
} from './dto/create-subscription-type.dto';
import { UpdateSubscriptionTypeDto } from './dto/update-subscription-type.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  CollectionResponse,
  ValidationPipe,
} from '@forlagshuset/nestjs-mongoose-paginate';
import { SubscriptionTypeDocument } from './entities/subscription-type.entity';

@Controller('subscription-type')
@ApiTags('subscription-type')
export class SubscriptionTypeController {
  constructor(
    private readonly subscriptionTypeService: SubscriptionTypeService,
  ) {}

  @Post()
  async create(@Body() createSubscriptionTypeDto: CreateSubscriptionTypeDto) {
    return {
      data: await this.subscriptionTypeService.create(
        createSubscriptionTypeDto,
      ),
    };
  }

  @Get()
  async findAll() {
    return { data: await this.subscriptionTypeService.findAll() };
  }

  @Get('filter')
  async filter(
    @Query(new ValidationPipe(SubscriptionTypeProperties)) collectionDto: any,
  ): Promise<CollectionResponse<SubscriptionTypeDocument>> {
    return await this.subscriptionTypeService.filter(collectionDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { data: await this.subscriptionTypeService.findOne(id) };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionTypeDto: UpdateSubscriptionTypeDto,
  ) {
    return this.subscriptionTypeService.update(id, updateSubscriptionTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionTypeService.remove(id);
  }
}
