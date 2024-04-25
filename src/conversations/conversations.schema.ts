import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ConversationsEnum } from 'src/common/enums/conversations.enum';

export type ConversationsDocument = HydratedDocument<Conversations>;

@Schema()
export class Conversations {
  @Prop({ type: String, enum: ConversationsEnum, required: true })
  type: string;

  @Prop({ type: mongoose.Schema.Types.Date, default: 0 })
  last_send: Date;

  @Prop({ type: String, default: '' })
  last_message: Date;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  created_at: Date;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  updated_at: Date;
}

export const ConversationsSchema = SchemaFactory.createForClass(Conversations);
