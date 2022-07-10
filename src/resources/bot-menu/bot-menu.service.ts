import { Injectable } from '@nestjs/common';
import { EnTranslations } from 'src/helpers/constants';
import BotMenuBuilder from 'src/helpers/menu.builder';
import { BotService } from '../bot/bot.service';
import { Bot } from '../bot/entities/bot.entity';

@Injectable()
export class BotMenuService {
  constructor(private botService: BotService) {}

  async botManager(source: string, message: string) {
    //check if its the init message
    const botSession = await this.botService.getCurrentSession(source);
    if (!botSession) {
      const bot = new Bot();
      bot.source = source;
      bot.status = 'pending';
      bot.currentMenu = this.menuResolver('1').Next;
      bot.nextMenu = this.menuResolver('1').Next;
      bot.previousMenu = this.menuResolver('1').Previous;
      await this.botService.create(bot);
      return this.menuResolver(bot.currentMenu).exec().build();
    }
    const menu = this.menuResolver(botSession.currentMenu);
    const isValidResponse = this.validateMenuResponse(menu.Current, message);
    if (isValidResponse) {
      return this.menuResolver(menu.Next).exec().build();
    } else {
      return this.menuResolver(menu.Current).setIsValidResponse(false).build();
    }
  }

  menuResolver(stage: string) {
    switch (stage) {
      case '1':
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
          '1',
          '1',
          validation,
          validationResponse,
          expectedResponses,
        )
          .get()
          .setAction((message: string) => {
            console.log(message);
          });

      default:
        return null;
    }
  }

  validateMenuResponse(stage: string, message: string) {
    const menu = this.menuResolver(stage);
    const matched = menu.ExpectedResponses.filter(
      (resp) => resp.toLowerCase() === message.toLowerCase(),
    );
    if (matched.length > 0) {
      return true;
    }
    return message.match(`/${menu.Validation}/ig`).length > 0;
  }
}
