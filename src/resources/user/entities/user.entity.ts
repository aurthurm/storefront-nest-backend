import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role, UserRoles } from 'src/helpers/constants';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  pin: string;

  @Prop()
  resetPinKey: string;

  @Prop({
    default: true,
  })
  requirePinChange: boolean;

  @Prop()
  password: string;

  @Prop()
  resetPasswordKey: string;

  @Prop({
    default: true,
  })
  requirePasswordChange: boolean;

  @Prop({
    unique: true,
  })
  phone: string;

  @Prop({
    unique: true,
  })
  waBotPhone: string;

  @Prop()
  firstName: string;

  @Prop()
  middleName: string;

  @Prop()
  lastName: string;

  @Prop()
  name: string;

  @Prop()
  lastLogin: Date;

  @Prop()
  lastPasswordReset: Date;

  @Prop({
    index: true,
    type: [{ type: String, enum: UserRoles }],
  })
  roles: Role[];

  @Prop()
  status: string;

  @Prop()
  address: string;

  @Prop()
  createdBy: string;

  @Prop({
    min: 1,
    max: 100,
  })
  completeness: number;

  @Prop({
    default: false,
  })
  botActive: boolean;

  // Estate Agent Council Verification Number
  @Prop({})
  eacNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
