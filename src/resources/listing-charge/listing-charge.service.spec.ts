import { Test, TestingModule } from '@nestjs/testing';
import { ListingChargeService } from './listing-charge.service';

describe('ListingChargeService', () => {
  let service: ListingChargeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListingChargeService],
    }).compile();

    service = module.get<ListingChargeService>(ListingChargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
