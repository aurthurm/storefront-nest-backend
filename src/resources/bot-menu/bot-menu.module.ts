import { Module } from '@nestjs/common';
import { BotMenuService } from './bot-menu.service';
import { BotMenuController } from './bot-menu.controller';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [BotModule],
  controllers: [BotMenuController],
  providers: [BotMenuService],
})
export class BotMenuModule {}
