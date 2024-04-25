import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class SearchFriendsDto {
  inviter: mongoose.Types.ObjectId;

  limit: number;

  // Name
  @IsNotEmpty()
  search: string;
}
