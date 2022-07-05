import { PartialType } from '@nestjs/mapped-types';
import { CreateBotMenuDto } from './create-bot-menu.dto';

export class UpdateBotMenuDto extends PartialType(CreateBotMenuDto) {}
