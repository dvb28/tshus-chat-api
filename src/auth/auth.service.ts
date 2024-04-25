import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersDto } from 'src/common/dto/user/users.dto';
import { jwtConstants } from './constants';
import { SignUpDto } from 'src/common/dto/sign/sign-up.dto';
import { AuthDto } from 'src/common/dto/sign/auth.dto';
import { ErrorStatus } from 'src/common/global/error.status';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<AuthDto> {
    // Excetion
    const SignException = new HttpException(
      'Thông tin đăng nhập không đúng',
      HttpStatus.UNAUTHORIZED,
    );

    // Exception
    try {
      // Find user by username
      const findUser = await this.usersService.findByEmail(email);

      // User is exists
      if (!findUser) throw SignException;

      // Check password matched
      const isMatch = await bcrypt.compare(pass, findUser?.password);

      // Check password not successful
      if (!isMatch) throw SignException;

      // JWT Payload
      const payload = { sub: findUser.id, email: findUser.email };

      // Parse type user data
      const user: UsersDto = new UsersDto(findUser);

      // Expirate time
      const expTime = parseInt(jwtConstants.expiresIn) * 1000;

      // Token data
      const token = {
        accessToken: this.jwtService.sign(payload),
        expiration: new Date(Date.now() + expTime),
      };

      const result: AuthDto = { token, user };

      // Return
      return result;
    } catch (error) {
      // Throw Error
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  async signUp(body: SignUpDto): Promise<boolean> {
    // Exception
    try {
      // Check password and confirm password matching
      if (body?.password !== body?.confirm) {
        throw new HttpException(
          'Mật khẩu không trùng khớp nhau!',
          HttpStatus.CONFLICT,
        );
      }

      // Find user by email
      const findUser = await this.usersService.findByEmail(body.email);

      // Check user is exists
      if (findUser) {
        // Throw error unthorized
        throw new HttpException('Email đã được đăng ký', HttpStatus.CONFLICT);
      } else {
        // Sign up created
        await this.usersService.create(body);

        // Return
        return true;
      }
    } catch (error) {
      // Throw Error
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }
}
