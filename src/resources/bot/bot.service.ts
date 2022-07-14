import { UpdateBotDto } from './dto/update-bot.dto';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnTranslations } from 'src/helpers/constants';
import BotMenuBuilder from 'src/helpers/menu.builder';
import { Bot } from './entities/bot.entity';
import { BotAccountService } from 'src/providers/bot-account/bot-account.service';


@Injectable()
export class BotService {
  source = '';
  isUserRegistered = false;
  menu: BotMenuBuilder = null;
  constructor(@InjectModel(Bot.name) private readonly botModel: Model<Bot>, 
   private botAccountService: BotAccountService) { }
  //

  async getWhatsAppResponse(source: string, message: string) {
    //
    this.source = source;
    return await this.botManager(source, message);
  }

  async botManager(source: string, message: string) {
    //check if its the init message
    const botSession = await this.getCurrentSession(source);
    if (botSession === null) {
      // Is user registered?
      const account = await this.botAccountService.checkIfAccountExists(source);
      console.log(account);

      if(account === null){

      } else {}

      this.menu = this.menuResolver('init');
      const bot = new Bot();
      bot.source = source;
      bot.status = 'pending';
      bot.currentMenu = this.menu.Current;
      bot.nextMenu ='main' //account? (account?.botActive ? 'main': 'terminate'): 'registration';
      bot.previousMenu = this.menu.Previous;
      bot.menuLock = true;
      await this.create(bot);
      return this.menu.exec().build();
    }
    this.menu = this.menuResolver(botSession.currentMenu);
    const isValidResponse = this.validateMenuResponse(message);
    if (isValidResponse) {
      await this.moveBotCursor(this.menu.Current, this.menu.Next, null);
      // console.log('Next Menu', menu.Next);
      return this.menuResolver(this.menu.Next??'terminate').exec().build();
    }
    else {
      return this.menuResolver(this.menu.Current)
        .setIsValidResponse(false)
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

        const nextMenu = 'main';//this.isUserRegistered?'terminate':'registration';
        return new BotMenuBuilder(
          title,
          options,
          null,
          'init',
          nextMenu,
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(() => { });
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
          'registration',
          null,
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((message: string) => {
            console.log('Action fired', message);
          });
      }
      
      case 'main': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.MAIN_MENU;
        return new BotMenuBuilder(
          title,
          options,
          'init',
          'main',
          null,
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((message: string) => {
            console.log('Action fired', message);
          });
      }

      case 'terminate': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.TERMINATE_BOT;
        return new BotMenuBuilder(
          title,
          options,
          null,
          null,
          null,
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (message: string) => {
            console.log('terminate Action fired', message); const { _id } = (await this.getCurrentSession(this.source)) as any;
            return this.updateSession(_id, {
              status: "closed",
              menuLock: false,
            });
          });
      }

      default:
        
    }
  }

  validateMenuResponse(message: string) {
    const matched = this.menu.ExpectedResponses.filter((resp: any) => {
      return resp.toString().toLowerCase() === message.toLowerCase();
    });
    if (matched.length > 0) {
      return true;
    }
    return message.match(`/${this.menu.Validation}/ig`) !== null;
  }

  create(bot: Bot) {
    return new this.botModel(bot).save();
  }

  getCurrentSession(source: string): Promise<Bot> {
    return this.botModel.findOne({ source: source, status: 'pending' }).lean().exec();
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
