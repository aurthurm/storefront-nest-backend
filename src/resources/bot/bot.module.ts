import { Bot, BotSchema } from './entities/bot.entity';
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BotAccountService } from 'src/providers/bot-account/bot-account.service';
import { UserModule } from '../user/user.module';
import { SmsService } from 'src/providers/sms/sms.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bot.name, schema: BotSchema }]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    UserModule,
  ],
  controllers: [BotController],
  providers: [BotService, BotAccountService, SmsService],
  exports: [BotService],
})
export class BotModule {}
