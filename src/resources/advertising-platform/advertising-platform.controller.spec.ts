import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingPlatformController } from './advertising-platform.controller';
import { AdvertisingPlatformService } from './advertising-platform.service';

describe('AdvertisingPlatformController', () => {
  let controller: AdvertisingPlatformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertisingPlatformController],
      providers: [AdvertisingPlatformService],
    }).compile();

    controller = module.get<AdvertisingPlatformController>(AdvertisingPlatformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
