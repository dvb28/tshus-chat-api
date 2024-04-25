import { IsNotEmpty } from 'class-validator';
import { RoomMembersCreateDto } from './room-members-create.dto';
import mongoose from 'mongoose';

export class RoomMembersAddDto {
  @IsNotEmpty()
  user: mongoose.Types.ObjectId;
  @IsNotEmpty()
  member: RoomMembersCreateDto;

  @IsNotEmpty()
  room: mongoose.Types.ObjectId;
}
