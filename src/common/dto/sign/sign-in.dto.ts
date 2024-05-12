import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được trống' })
  @MinLength(8, { message: 'Mật khẩu phải nhiều hơn 5 ký tự' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, {
    message:
      'Mật khẩu phải bao gồm chữ số, số, chữ hoa, chữ thường, kí tự đặc biệt',
  })
  password: string;
}
