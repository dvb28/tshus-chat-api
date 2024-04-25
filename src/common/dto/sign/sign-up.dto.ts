import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GenderEnum } from 'src/common/enums/gender.enum';

export class SignUpDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được trống' })
  @MinLength(5, { message: 'Mật khẩu phải nhiều hơn 5 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Giới tính không được troongs' })
  gender: GenderEnum;

  @IsString({ message: 'Tên đệm phải là chuỗi' })
  firstname: string;

  @IsNotEmpty({ message: 'Xác nhận mật khẩu không được trống' })
  confirm: string;

  @IsString({ message: 'Tên phải là chuỗi' })
  lastname: string;

  @MinLength(10, { message: 'Số điện thoại không hợp lệ' })
  @MaxLength(10, { message: 'Số điện thoại không hợp lệ' })
  phone: string;

  @IsString()
  avatar: string;
}
