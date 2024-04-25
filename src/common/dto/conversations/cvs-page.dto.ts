import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CvsPageDto {
  @IsNotEmpty()
  page: number;

  @IsMongoId()
  user: mongoose.Types.ObjectId;
}
