import { Test, TestingModule } from '@nestjs/testing';
import { BotMenuController } from './bot-menu.controller';
import { BotMenuService } from './bot-menu.service';

describe('BotMenuController', () => {
  let controller: BotMenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotMenuController],
      providers: [BotMenuService],
    }).compile();

    controller = module.get<BotMenuController>(BotMenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
