import { UsersDto } from '../user/users.dto';

type TokenType = {
  accessToken: string;
  expiration: any;
};

export class AuthDto {
  token: TokenType;
  user: UsersDto;
}
