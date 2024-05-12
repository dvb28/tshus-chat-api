import { IsNotEmpty } from 'class-validator';

export class LoadRequestReqDto {
  @IsNotEmpty({ message: 'Người dùng không được trống' })
  user: string;
}

export class LoadRequestResDto {
  request: any;
  sended: any;
}
