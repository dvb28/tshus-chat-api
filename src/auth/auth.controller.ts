import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorator/auth.decorator';
import { SignInDto } from 'src/common/dto/sign/sign-in.dto';
import { SignUpDto } from 'src/common/dto/sign/sign-up.dto';
import { ResponseData } from 'src/common/global/response.data';
import { AuthDto } from 'src/common/dto/sign/auth.dto';
import { ResponseMessage } from 'src/common/global/response.message';

@Controller('auth')
export class AuthController {
  // Constructor
  constructor(private authService: AuthService) {}

  // [POST] /login
  @Public()
  @HttpCode(200)
  @Post('login')
  async signIn(@Body(new ValidationPipe()) rData: SignInDto) {
    // Signed Response
    const data: AuthDto = await this.authService.signIn(
      rData.email,
      rData.password,
    );

    // Return
    return new ResponseData<AuthDto>({ data }, HttpStatus.OK);
  }

  // [POST] /register
  @Public()
  @HttpCode(200)
  @Post('register')
  async register(@Body(new ValidationPipe()) signUpDto: SignUpDto) {
    // Signed Response
    await this.authService.signUp(signUpDto);

    // Return
    return new ResponseMessage('Đăng ký thành công', HttpStatus.OK);
  }
}
