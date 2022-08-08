import { Test, TestingModule } from '@nestjs/testing';
import { ListingChargeController } from './listing-charge.controller';
import { ListingChargeService } from './listing-charge.service';

describe('ListingChargeController', () => {
  let controller: ListingChargeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListingChargeController],
      providers: [ListingChargeService],
    }).compile();

    controller = module.get<ListingChargeController>(ListingChargeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
