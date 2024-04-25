import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class ChaterDTO {
  avatar: string;

  @IsMongoId()
  user: mongoose.Types.ObjectId;

  @IsNotEmpty({ message: 'Nickname không được trống' })
  nickname: mongoose.Types.ObjectId;
}
