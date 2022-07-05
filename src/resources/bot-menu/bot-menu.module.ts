import { Module } from '@nestjs/common';
import { BotMenuService } from './bot-menu.service';
import { BotMenuController } from './bot-menu.controller';

@Module({
  controllers: [BotMenuController],
  providers: [BotMenuService]
})
export class BotMenuModule {}
