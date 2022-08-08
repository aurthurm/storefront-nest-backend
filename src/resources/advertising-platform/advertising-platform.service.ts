import { Injectable } from '@nestjs/common';
import { CreateAdvertisingPlatformDto } from './dto/create-advertising-platform.dto';
import { UpdateAdvertisingPlatformDto } from './dto/update-advertising-platform.dto';

@Injectable()
export class AdvertisingPlatformService {
  create(createAdvertisingPlatformDto: CreateAdvertisingPlatformDto) {
    return 'This action adds a new advertisingPlatform';
  }

  findAll() {
    return `This action returns all advertisingPlatform`;
  }

  findOne(id: number) {
    return `This action returns a #${id} advertisingPlatform`;
  }

  update(id: number, updateAdvertisingPlatformDto: UpdateAdvertisingPlatformDto) {
    return `This action updates a #${id} advertisingPlatform`;
  }

  remove(id: number) {
    return `This action removes a #${id} advertisingPlatform`;
  }
}
