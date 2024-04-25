import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class MessagesPageDto {
  @IsNotEmpty()
  page: number;

  @IsMongoId()
  conversation: mongoose.Types.ObjectId;
}
