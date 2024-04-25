import {
  Post,
  Body,
  Controller,
  HttpCode,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { JoinDto } from 'src/common/dto/chats/chats-join.dto';
import { ChatsService } from './chats.service';
import { ResponseData } from 'src/common/global/response.data';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}
  // [POST] join
  @HttpCode(200)
  @Post('join')
  async join(@Body(new ValidationPipe()) body: JoinDto) {
    // Join
    const joined = await this.chatsService.join(body);

    // Return
    return new ResponseData({ data: joined }, HttpStatus.OK);
  }
}
