import { Controller, All, Req, Post } from '@nestjs/common';
import { Request } from 'express';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post()
  async create(@Req() request: Request) {
    const { source, message } = request.body;
    return await this.botService.getWhatsAppResponse(source, message);
  }
}
