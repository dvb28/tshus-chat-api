import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class JoinType {
  @IsString({ message: 'Nickname phải là chuỗi' })
  nickname: string;

  @IsMongoId({ message: 'ID của người dùng không hợp lệ' })
  user: string;
}

export class JoinDto {
  @IsNotEmpty({ message: 'Inviter không được trống' })
  inviter: JoinType;

  @IsNotEmpty({ message: 'Friend không được trống' })
  friend: JoinType;
}
