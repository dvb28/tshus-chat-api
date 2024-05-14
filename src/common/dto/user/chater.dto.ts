import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ChaterDTO {
  avatar: string;

  @IsMongoId()
  user: string;

  @IsNotEmpty({ message: 'Nickname không được trống' })
  nickname: string;
}
