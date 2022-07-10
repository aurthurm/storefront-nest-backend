import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bot } from './entities/bot.entity';

@Injectable()
export class BotService {
  constructor(@InjectModel(Bot.name) private readonly botModel: Model<Bot>) {}
  //

  async getWhatsAppResponse(source: string, message: string) {
    //
    return await this.getCurrentSession(source);
  }

  getCurrentSession(source: string): Promise<Bot> {
    return this.botModel.findOne({ source: source, status: 'pending' }).exec();
  }

  create(bot: Bot) {
    return new this.botModel(bot).save();
  }
}
