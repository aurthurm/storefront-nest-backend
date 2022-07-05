import { Controller, All, Req } from '@nestjs/common';
import { Request } from 'express';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @All()
  create(@Req() request: Request) {
    const { source, message } = request.body;
    return this.botService.getWhatsAppResponse(source, message);
  }
}
