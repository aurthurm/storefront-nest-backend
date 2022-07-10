import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = Bot & Document;

@Schema({
  timestamps: true,
})
export class Bot {
  @Prop()
  source: string;

  @Prop()
  previousMenu: string;

  @Prop()
  currentMenu: string;

  @Prop()
  nextMenu: string;

  @Prop({ enum: ['pending', 'closed'] })
  status: string;

  @Prop({
    default: true,
  })
  menuLock: boolean;
}

export const BotSchema = SchemaFactory.createForClass(Bot);
