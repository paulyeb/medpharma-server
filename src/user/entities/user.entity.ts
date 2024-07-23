import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({})
  password: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({})
  staffID: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
