import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { GenderEnum } from 'src/common/enums/gender.enum';
import { OnlineEnum } from 'src/common/enums/online.enum';
import { Role } from 'src/common/enums/role.enum';

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop({ required: true })
  email: string;

  @Prop()
  avatar: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, maxlength: 10 })
  phone: string;

  @Prop({
    type: String,
    enum: GenderEnum,
    required: true,
  })
  gender: string;

  @Prop({
    type: [String],
    required: true,
    default: Role.USER,
    enum: Role,
  })
  roles: Role[];

  @Prop(
    raw({
      state: { type: String, default: OnlineEnum.OFFLINE, enum: OnlineEnum },
      time: { type: Date, require: true },
    }),
  )
  online: Record<string, any>;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  created_at: Date;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  updated_at: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
