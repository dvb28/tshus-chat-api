import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ChaterDTO } from 'src/common/dto/user/chater.dto';
import { MessagesType } from 'src/common/enums/messages-type.enum';

export type MessagesDocument = HydratedDocument<Messages>;

@Schema()
export class Messages {
  @Prop({
    required: true,
    ref: 'Conversations',
    typpe: mongoose.Schema.Types.ObjectId,
  })
  conversation: mongoose.Types.ObjectId;

  @Prop()
  messages: string;

  @Prop()
  files: string[];

  @Prop(
    raw({
      nickname: { type: String },
      avatar: { type: String, default: '' },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    }),
  )
  seenders: Record<undefined, ChaterDTO[]>;

  @Prop({ type: mongoose.Schema.Types.Date, required: false })
  seen_at: Date;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  send_at: Date;

  @Prop({ default: String, enum: MessagesType, required: true })
  type: string;

  @Prop(
    raw({
      nickname: { type: String, required: true },
      avatar: { type: String, default: '' },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    }),
  )
  sender: ChaterDTO;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  created_at: Date;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  updated_at: Date;
}

export const MessagesSchema = SchemaFactory.createForClass(Messages);
