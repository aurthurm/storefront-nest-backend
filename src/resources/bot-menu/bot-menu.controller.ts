import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BotMenuService } from './bot-menu.service';
import { CreateBotMenuDto } from './dto/create-bot-menu.dto';
import { UpdateBotMenuDto } from './dto/update-bot-menu.dto';

@Controller('bot-menu')
export class BotMenuController {
  constructor(private readonly botMenuService: BotMenuService) {}
}
