import { IsNotEmpty } from 'class-validator';

export class FriendsPageDto {
  @IsNotEmpty({ message: 'Người dùng không được trống' })
  user: string;
}
