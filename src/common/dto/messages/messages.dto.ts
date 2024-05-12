import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { ChaterDTO } from '../user/chater.dto';
import { MessagesType } from 'src/common/enums/messages-type.enum';

export class MessagesDto {
  @IsMongoId()
  conversation: mongoose.Types.ObjectId;

  @IsString()
  type: MessagesType;

  files: any;

  @IsString()
  messages: string;

  @IsNotEmpty()
  sender: ChaterDTO;

  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  from: string;
}
