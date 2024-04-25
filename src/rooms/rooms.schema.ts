import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoomsDocument = HydratedDocument<Rooms>;

@Schema()
export class Rooms {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversations',
    unique: true,
  })
  conversation: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true, index: 'text' })
  name: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: Number, required: true })
  members_count: number;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  created_at: Date;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  updated_at: Date;
}

export const RoomsSchema = SchemaFactory.createForClass(Rooms);
