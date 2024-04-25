import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ChaterDTO } from 'src/common/dto/user/chater.dto';

export type ChatsDocument = HydratedDocument<Chats>;

@Schema()
export class Chats {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversations',
    unique: true,
  })
  conversation: mongoose.Types.ObjectId;

  @Prop(
    raw({
      nickname: { type: String },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    }),
  )
  inviter: ChaterDTO;

  @Prop(
    raw({
      nickname: { type: String, index: 'text' },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    }),
  )
  friend: ChaterDTO;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  created_at: Date;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  updated_at: Date;
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);
