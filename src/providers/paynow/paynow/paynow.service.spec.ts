import { Test, TestingModule } from '@nestjs/testing';
import { PaynowService } from './paynow.service';

describe('PaynowService', () => {
  let service: PaynowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaynowService],
    }).compile();

    service = module.get<PaynowService>(PaynowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
