import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { RoomMembersRoleEnum } from 'src/common/enums/room-members-role.enum';

export type RoomMembersDocument = HydratedDocument<RoomMembers>;

@Schema()
export class RoomMembers {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Rooms' })
  room: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true, index: 'text' })
  nickname: string;

  @Prop({ type: Boolean, default: false })
  block: boolean;

  @Prop({
    type: String,
    enum: RoomMembersRoleEnum,
    default: RoomMembersRoleEnum.MEMBER,
  })
  role: RoomMembersRoleEnum;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  created_at: Date;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  updated_at: Date;
}

export const RoomMembersSchema = SchemaFactory.createForClass(RoomMembers);
