import { IsNotEmpty } from 'class-validator';
import { ChaterDTO } from './chater.dto';

export class FriendRequestDto {
  @IsNotEmpty({ message: 'Inviter không được trống' })
  inviter: ChaterDTO;

  @IsNotEmpty({ message: 'Inviter không được trống' })
  friend: ChaterDTO;
}
