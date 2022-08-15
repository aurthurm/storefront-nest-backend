import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TenantDocument = Tenant & Document;

@Schema({
  timestamps: true,
})
export class Tenant {
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  fullName: string;
  @Prop()
  address: string;
  @Prop()
  city: string;
  @Prop()
  suburb: string;
  @Prop()
  street: string;
  @Prop()
  currentLease: string;
  @Prop()
  status: string;
}
export const TenantSchema = SchemaFactory.createForClass(Tenant);
