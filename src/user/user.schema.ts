import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserType } from 'src/utils/types';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  email: string;

  @Prop({
    enum: [UserType.HEALTH_OFFICER, UserType.PATIENT],
    required: true,
  })
  type: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
