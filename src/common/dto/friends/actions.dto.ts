import { IsNotEmpty } from 'class-validator';

export class FriendsActionsDto {
  @IsNotEmpty({ message: 'Hành động không được trống' })
  action: string;

  @IsNotEmpty({ message: 'Mã bạn bè không được trống' })
  id: string;

  @IsNotEmpty({ message: 'Người nhận không được trống' })
  receiver: string;
}
