import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdvertisingPlatformService } from './advertising-platform.service';
import { CreateAdvertisingPlatformDto } from './dto/create-advertising-platform.dto';
import { UpdateAdvertisingPlatformDto } from './dto/update-advertising-platform.dto';

@Controller('advertising-platform')
export class AdvertisingPlatformController {
  constructor(private readonly advertisingPlatformService: AdvertisingPlatformService) {}

  @Post()
  create(@Body() createAdvertisingPlatformDto: CreateAdvertisingPlatformDto) {
    return this.advertisingPlatformService.create(createAdvertisingPlatformDto);
  }

  @Get()
  findAll() {
    return this.advertisingPlatformService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.advertisingPlatformService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdvertisingPlatformDto: UpdateAdvertisingPlatformDto) {
    return this.advertisingPlatformService.update(+id, updateAdvertisingPlatformDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advertisingPlatformService.remove(+id);
  }
}
