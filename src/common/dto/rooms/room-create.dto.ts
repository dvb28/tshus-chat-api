import mongoose from 'mongoose';
import { MessagesType } from 'src/common/enums/messages-type.enum';
import { IsNotEmpty } from 'class-validator';
import { RoomMembersCreateDto } from '../roommembers/room-members-create.dto';

export class RoomCreateDto {
  @IsNotEmpty()
  name: mongoose.Types.ObjectId;

  @IsNotEmpty()
  conversation: mongoose.Types.ObjectId;

  creater: RoomMembersCreateDto;

  image: MessagesType;

  members?: Array<RoomMembersCreateDto>;
}
