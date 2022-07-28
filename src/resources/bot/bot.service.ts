import { Injectable } from '@nestjs/common';
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
  constructor(
    @InjectModel(Bot.name) private readonly botModel: Model<Bot>,
    private botAccountService: BotAccountService,
  ) {}
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
      let nextMenu = '3';
      if (account) {
        nextMenu = '2';
        if (!account.botActive) nextMenu = '4';
      }

      this.menu = this.menuResolver('1');

      const bot = new Bot();
      bot.source = source;
      bot.status = 'pending';
      bot.currentMenu = this.menu.Current;
      bot.nextMenu = nextMenu;
      bot.previousMenu = this.menu.Previous;
      bot.responses = { greetings: message };
      bot.menuLock = true;
      await this.create(bot);
      this.menu.Current = nextMenu;
      return this.menu.build();
    }
    this.menu = this.menuResolver(botSession.currentMenu);
    const isValidResponse = this.validateMenuResponse(message);
    if (isValidResponse) {
      let nextMenu = this.menu.Next ?? botSession.nextMenu;

      if (nextMenu === null) {
        nextMenu = botSession.currentMenu + `.${message}.1`;
      }

      // fire relative action
      const response = await this.menu.exec(message);
      console.log(response);

      if (response.success) {
        //Update session to progress to the next menu
        await this.moveBotCursor(botSession.currentMenu, nextMenu, null);
        //return next menu
        return this.menuResolver(nextMenu).build();
      }
      return this.menuResolver(botSession.currentMenu).build();
    } else {
      return this.menuResolver(this.menu.Current)
        .setIsValidResponse(false)
        .build();
    }
  }

  menuResolver(stage: string) {
    switch (stage) {
      case '1': {
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
          null,
          '1',
          null,
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(() => {
            return {
              success: true,
              message: '',
            };
          });
      }
      case '2': {
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
          '1',
          '2',
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
      case '3': {
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
          '1',
          '3',
          null,
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((message: string) => {
            return {
              success: true,
              message: '',
            };
          });
      }
      // Get PHONE
      case '3.2.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_PHONE_MENU;
        return new BotMenuBuilder(
          title,
          options,
          '3',
          '3.2.1',
          '3.2.2',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((source: string) => {
            console.log('Save phone to account', source);
            this.updateBotSession({ 'responses.get_phone': source });
            return {
              success: true,
              message: '',
            };
          });
      }
      // Confirm PHONE
      case '3.2.2': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.CONFIRM_PHONE_MENU;
        return new BotMenuBuilder(
          title,
          options,
          '3.2.1',
          '3.2.2',
          '3.2.3',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (source: string) => {
            console.log('Confirm Number fired', source);
            this.updateBotSession({ 'responses.confirmed_phone': source });
            const success = await this.confirmNumber(source);
            if (success) this.botAccountService.createAccount(source);
            return {
              success,
              message: '',
            };
          });
      }

      case '3.2.3': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_PIN_MENU;
        return new BotMenuBuilder(
          title,
          options,
          '3.2.2',
          '3.2.3',
          '3.2.4',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((pin: string) => {
            console.log('Get Pin fired', pin);
            this.updateBotSession({ 'responses.get_pin': pin });
          });
      }

      case '3.2.4': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.CONFIRM_PIN_MENU;
        return new BotMenuBuilder(
          title,
          options,
          '3.2.3',
          '3.2.4',
          '4',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((pin: string) => {
            console.log('Confirm Pin fired', pin);
            this.updateBotSession({ 'responses.confirmed_pin': pin });
          });
      }

      case '4': {
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
            console.log('4 Action fired', message);
            const { _id } = (await this.getCurrentSession(this.source)) as any;
            return this.updateSession(_id, {
              status: 'closed',
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
    console.log(matched);
    if (matched.length > 0) {
      return true;
    }
    return this.menu.Validation.test(message);
  }

  create(bot: Bot) {
    return new this.botModel(bot).save();
  }

  getCurrentSession(source: string): Promise<Bot> {
    return this.botModel
      .findOne({ source: source, status: 'pending' })
      .lean()
      .exec();
  }
  updateSession(id: string, payload = {}) {
    return this.botModel.findByIdAndUpdate(id, payload);
  }

  async moveBotCursor(previousMenu, currentMenu, nextMenu) {
    const { _id } = (await this.getCurrentSession(this.source)) as any;
    return this.updateSession(_id, {
      previousMenu,
      currentMenu,
      nextMenu,
      menuLock: false,
    });
  }

  async updateBotSession(query: any) {
    const { _id } = (await this.getCurrentSession(this.source)) as any;
    return this.updateSession(_id, query);
  }

  async confirmNumber(source: string): Promise<boolean> {
    const { responses } = (await this.getCurrentSession(this.source)) as any;
    return responses['get_phone'] === source;
  }
}
