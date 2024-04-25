import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { FriendsStateEnum } from 'src/common/enums/friends-state.enum';

export type FriendsDocument = HydratedDocument<Friends>;

@Schema()
export class Friends {
  @Prop(
    raw({
      avatar: { type: String, default: '' },
      nickname: { type: String, default: '', index: 'text' },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    }),
  )
  inviter: Record<string, any>;

  @Prop(
    raw({
      avatar: { type: String, default: '' },
      nickname: { type: String, default: '', index: 'text' },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    }),
  )
  friend: Record<string, any>;

  @Prop({
    type: String,
    required: true,
    enum: FriendsStateEnum,
    default: FriendsStateEnum.PENDING,
  })
  state: FriendsStateEnum;

  @Prop({ type: Boolean, default: false })
  block: boolean;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  friend_at: Date;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  updated_at: Date;
}

export const FriendsSchema = SchemaFactory.createForClass(Friends);
