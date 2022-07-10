import { UpdateBotDto } from './dto/update-bot.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnTranslations } from 'src/helpers/constants';
import BotMenuBuilder from 'src/helpers/menu.builder';
import { Bot } from './entities/bot.entity';

@Injectable()
export class BotService {
  source = '';
  constructor(@InjectModel(Bot.name) private readonly botModel: Model<Bot>) {}
  //

  async getWhatsAppResponse(source: string, message: string) {
    //
    this.source = source;
    return await this.botManager(source, message);
  }

  async botManager(source: string, message: string) {
    //check if its the init message
    const botSession = await this.getCurrentSession(source);
    if (!botSession) {
      const bot = new Bot();
      bot.source = source;
      bot.status = 'pending';
      bot.currentMenu = this.menuResolver('init').Current;
      bot.nextMenu = this.menuResolver('init').Next;
      bot.previousMenu = this.menuResolver('init').Previous;
      await this.create(bot);
      return this.menuResolver(bot.currentMenu).exec().build();
    }
    const menu = this.menuResolver(botSession.currentMenu);
    let isValidResponse = true;
    if (botSession.menuLock)
      isValidResponse = this.validateMenuResponse(menu.Current, message);

    if (isValidResponse) {
      //   moveBotCursor(prevStage, currentStage, nextStage)
      this.moveBotCursor(menu.Current, menu.Next, null);
      console.log('Next Menu', menu.Next);
      return this.menuResolver(menu.Next).exec().build();
    } else {
      return this.menuResolver(menu.Current)
        .setIsValidResponse(isValidResponse)
        .build();
    }
  }

  menuResolver(stage: string) {
    switch (stage) {
      case 'init': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.LISTING_INIT_MESSAGE;
        return new BotMenuBuilder(
          title,
          options,
          'init',
          'registration',
          null,
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(() => {});
      }

      case 'registration': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.REGISTRATION_MENU;
        return new BotMenuBuilder(
          title,
          options,
          'init',
          'init',
          '1',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((message: string) => {
            console.log('Action fired', message);
          });
      }

      default:
        return this.menuResolver('init');
    }
  }

  validateMenuResponse(stage: string, message: string) {
    const menu = this.menuResolver(stage);
    const matched = menu.ExpectedResponses.filter((resp: any) => {
      return resp.toString().toLowerCase() === message.toLowerCase();
    });
    if (matched.length > 0) {
      return true;
    }
    return message.match(`/${menu.Validation}/ig`) !== null;
  }

  create(bot: Bot) {
    return new this.botModel(bot).save();
  }

  getCurrentSession(source: string): Promise<Bot> {
    return this.botModel.findOne({ source: source, status: 'pending' }).exec();
  }
  updateSession(id: string, payload = {}) {
    return this.botModel.findByIdAndUpdate(id, payload);
  }

  async moveBotCursor(prevMenu, currentMenu, nextMenu) {
    const { _id } = (await this.getCurrentSession(this.source)) as any;
    return this.updateSession(_id, {
      prevMenu,
      currentMenu,
      nextMenu,
      menuLock: false,
    });
  }
}
