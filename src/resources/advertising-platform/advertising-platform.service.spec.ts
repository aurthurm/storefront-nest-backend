import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisingPlatformService } from './advertising-platform.service';

describe('AdvertisingPlatformService', () => {
  let service: AdvertisingPlatformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertisingPlatformService],
    }).compile();

    service = module.get<AdvertisingPlatformService>(AdvertisingPlatformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
