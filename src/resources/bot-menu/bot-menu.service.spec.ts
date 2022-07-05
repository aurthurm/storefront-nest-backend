import { Test, TestingModule } from '@nestjs/testing';
import { BotMenuService } from './bot-menu.service';

describe('BotMenuService', () => {
  let service: BotMenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotMenuService],
    }).compile();

    service = module.get<BotMenuService>(BotMenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
