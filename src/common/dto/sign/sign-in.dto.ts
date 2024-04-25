import { IsEmail, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @MinLength(5, { message: 'Mật khẩu phải nhiều hơn 5 ký tự' })
  password: string;
}
