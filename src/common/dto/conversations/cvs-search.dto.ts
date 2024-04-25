import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CvsSearchDto {
  @IsNotEmpty()
  page: number;

  @IsMongoId()
  user: mongoose.Types.ObjectId;

  search: string;
}
