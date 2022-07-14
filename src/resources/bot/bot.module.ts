import { Bot, BotSchema } from './entities/bot.entity';
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BotAccountService } from 'src/providers/bot-account/bot-account.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bot.name, schema: BotSchema }]), UserModule],
  controllers: [BotController],
  providers: [BotService, BotAccountService],
  exports: [BotService],
})
export class BotModule {}
