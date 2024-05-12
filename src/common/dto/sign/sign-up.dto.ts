import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GenderEnum } from 'src/common/enums/gender.enum';

export class SignUpDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được trống' })
  @MinLength(8, { message: 'Mật khẩu phải nhiều hơn 5 ký tự' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
    message:
      'Mật khẩu phải bao gồm chữ số, số, chữ hoa, chữ thường, kí tự đặc biệt',
  })
  password: string;

  @IsNotEmpty({ message: 'Giới tính không được trống' })
  gender: GenderEnum;

  @IsNotEmpty({ message: 'Họ đệm không được trống' })
  @MaxLength(30, { message: 'Họ đệm không được quá 30 ký tự' })
  firstname: string;

  @IsNotEmpty({ message: 'Xác nhận mật khẩu không được trống' })
  confirm: string;

  @IsNotEmpty({ message: 'Tên không được trống' })
  @MaxLength(30, { message: 'Teen không được quá 30 ký tự' })
  lastname: string;

  @Length(10, 10, { message: 'Số điện thoại gồm 10 số từ 0 - 9' })
  phone: string;
}
