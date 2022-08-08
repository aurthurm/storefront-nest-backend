import { Module } from '@nestjs/common';
import { AdvertisingPlatformService } from './advertising-platform.service';
import { AdvertisingPlatformController } from './advertising-platform.controller';

@Module({
  controllers: [AdvertisingPlatformController],
  providers: [AdvertisingPlatformService]
})
export class AdvertisingPlatformModule {}
