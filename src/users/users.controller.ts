import {
  Get,
  Query,
  Controller,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUsersDto } from 'src/common/dto/user/find-user.dto';
import { ResponseData } from 'src/common/global/response.data';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // [ROLE] USER

  // [GET] /find
  @HttpCode(200)
  @Get('find')
  async find(@Query(new ValidationPipe()) query: FindUsersDto) {
    // Find user by type
    const data = await this.usersService.find(query);

    // Return
    return new ResponseData({ data }, HttpStatus.OK);
  }
}
