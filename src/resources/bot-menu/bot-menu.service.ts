import { Injectable } from '@nestjs/common';
import { EnTranslations } from 'src/helpers/constants';
import BotMenuBuilder from 'src/helpers/menu.builder';

@Injectable()
export class BotMenuService {
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
        ).get();
        break;

      default:
        break;
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
