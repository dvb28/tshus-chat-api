import { IsMongoId, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class FindUsersDto {
  @IsMongoId()
  user: mongoose.Types.ObjectId;

  @IsString()
  search: string;
}
