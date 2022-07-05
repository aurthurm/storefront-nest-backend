import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BotMenuService } from './bot-menu.service';
import { CreateBotMenuDto } from './dto/create-bot-menu.dto';
import { UpdateBotMenuDto } from './dto/update-bot-menu.dto';

@Controller('bot-menu')
export class BotMenuController {
  constructor(private readonly botMenuService: BotMenuService) {}

  @Post()
  create(@Body() createBotMenuDto: CreateBotMenuDto) {
    return this.botMenuService.create(createBotMenuDto);
  }

  @Get()
  findAll() {
    return this.botMenuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botMenuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBotMenuDto: UpdateBotMenuDto) {
    return this.botMenuService.update(+id, updateBotMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.botMenuService.remove(+id);
  }
}
