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
    const responses = {};
    const botSession = await this.getCurrentSession(source);
    if (botSession === null) {
      // Is user registered?
      const account = await this.botAccountService.checkIfAccountExists(source);
      let nextMenu = '3';
      if (account) {
        nextMenu = '2';
        if (!account.botActive) {
          nextMenu = '4';
          if (account.status == 'confirm') {
            responses['get_phone'] = account.waBotPhone;
            nextMenu = '3.2.2';
          }
        }
      }

      this.menu = this.menuResolver('1');

      const bot = new Bot();
      bot.source = source;
      bot.status = 'pending';
      bot.currentMenu = this.menu.Current;
      bot.nextMenu = nextMenu;
      bot.previousMenu = this.menu.Previous;
      bot.responses = { greetings: message, ...responses };
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

      if (response.success) {
        // Update session to progress to the next menu
        await this.moveBotCursor(botSession.currentMenu, nextMenu, null);
        //return next menu
        if (+nextMenu === 4) {
          return (await this.menuResolver(nextMenu).exec(response.message))
            .message;
        }
        return this.menuResolver(nextMenu).build();
      }

      return this.menuResolver(botSession.currentMenu)
        .setIsValidResponse(false)
        .setValidationResponse(response?.message)
        .build();
      //
    } else {
      // If response message is Invalid
      return this.menuResolver(this.menu.Current)
        .setIsValidResponse(false)
        .build();
    }
  }

  menuResolver(stage: string) {
    switch (stage) {
      // LISTING_INIT_MESSAGE
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

      // MAIN_MENU
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

      // REGISTRATION_MENU
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
            this.updateBotSession({ 'responses.confirmed_phone': source });
            const success = await this.confirmNumber(source);
            if (success) this.botAccountService.createAccount(source);
            return {
              success,
              message: success ? '' : 'Phones do not match',
            };
          });
      }

      // GET_PIN_MENU
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
            this.updateBotSession({ 'responses.get_pin': pin });
            return {
              success: true,
              message: '',
            };
          });
      }

      // CONFIRM_PIN_MENU
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
          .setAction(async (pin: number) => {
            this.updateBotSession({ 'responses.confirmed_pin': +pin });
            const success = await this.confirmPin(+pin);
            console.log('SOURCE : ', this.source);

            if (success) {
              this.botAccountService.activateAccount(this.source);
            }
            const successMessage = `Thank you for activating account ${this.source} please text Hi and Login with 4 digit pin for assistance please contact our support from the main menu`;
            return {
              success,
              message: success ? successMessage : 'Pins do not match',
            };
          });
      }

      // Get EXISTING PHONE
      case '3.3.1': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.GET_PHONE_EXISTING_MENU;
        return new BotMenuBuilder(
          title,
          options,
          '3',
          '3.3.1',
          '3.3.2',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (source: string) => {
            await this.updateBotSession({
              'responses.get_existing_phone': source,
            });

            const account = await this.botAccountService.checkIfAccountExists(
              source,
            );

            const exists = account !== null;

            if (!exists) {
              const { _id } = (await this.getCurrentSession(
                this.source,
              )) as any;
              await this.updateSession(_id, {
                status: 'closed',
                menuLock: false,
              });
            }

            // send sms

            return {
              success: exists,
              message: exists ? '' : 'Account does not exist',
            };
          });
      }

      // CONFIRM_EXISTING_PHONE_MENU
      case '3.3.2': {
        const {
          title,
          options,
          validation,
          validationResponse,
          expectedResponses,
        } = EnTranslations.CONFIRM_EXISTING_PHONE_MENU;
        return new BotMenuBuilder(
          title,
          options,
          '3.1.1',
          '3.3.2',
          '3.3.3',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (pin: number) => {
            this.updateBotSession({ 'responses.confirmation_pin': +pin });
            const success = await this.confirmExistingPhonePin(+pin);
            const successMessage = ``;
            return {
              success,
              message: success ? successMessage : 'Pins do not match',
            };
          });
      }

      // Get New PHONE
      case '3.3.3': {
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
          '3.3.2',
          '3.3.3',
          '3.3.4',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (source: string) => {
            let success = true;
            let message = '';
            const { responses } = (await this.getCurrentSession(
              this.source,
            )) as any;
            if (responses['get_existing_phone'] === source) {
              success = false;
              message = 'Current account cannot be the same as the previous';
            }
            this.updateBotSession({ 'responses.get_phone': source });
            return {
              success,
              message,
            };
          });
      }

      // Confirm New PHONE
      case '3.3.4': {
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
          '3.3.3',
          '3.3.4',
          '4',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction(async (source: string) => {
            this.updateBotSession({ 'responses.confirmed_phone': source });
            const success = await this.confirmNumber(source);
            let message = 'Phones do not match';
            if (success) {
              const { responses } = (await this.getCurrentSession(
                this.source,
              )) as any;
              await this.botAccountService.changeAccount(
                responses['get_existing_phone'],
                responses['get_phone'],
              );
              message = `Your account number has been changed to ${responses['get_phone']}`;
            }
            return {
              success,
              message,
            };
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
            const { _id } = (await this.getCurrentSession(this.source)) as any;
            await this.updateSession(_id, {
              status: 'closed',
              menuLock: false,
            });
            return {
              success: true,
              message: message,
            };
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

  async confirmPin(pin: number): Promise<boolean> {
    const { responses } = (await this.getCurrentSession(this.source)) as any;
    return +responses['get_pin'] === +pin;
  }

  async confirmExistingPhonePin(pin: number): Promise<boolean> {
    return 'accountExistPin' === 'accountExistPin';
  }
}
