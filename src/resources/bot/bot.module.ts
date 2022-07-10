import { Bot, BotSchema } from './entities/bot.entity';
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bot.name, schema: BotSchema }])],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
