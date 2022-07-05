import { Test, TestingModule } from '@nestjs/testing';
import { BotAccountService } from './bot-account.service';

describe('BotAccountService', () => {
  let service: BotAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotAccountService],
    }).compile();

    service = module.get<BotAccountService>(BotAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
