import {
  Post,
  Body,
  Controller,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendRequestDto } from 'src/common/dto/user/friend-request';
import { ResponseMessage } from 'src/common/global/response.message';
import { SearchFriendsDto } from 'src/common/dto/friends/search-friend.dto';
import { Public } from 'src/common/decorator/auth.decorator';
import { ResponseData } from 'src/common/global/response.data';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendService: FriendsService) {}
  // [ROLE] USER

  // [GET] /send
  @HttpCode(200)
  @Post('send')
  async send(@Body(new ValidationPipe()) body: FriendRequestDto) {
    // Send friend request service
    await this.friendService.send(body);

    // Return
    return new ResponseMessage('Đã gửi yêu cầu kết bạn', HttpStatus.OK);
  }

  // [GET] /search
  @Public()
  @HttpCode(200)
  @Get('search')
  async search(@Query(new ValidationPipe()) params: SearchFriendsDto) {
    // Search friend of user
    const data = await this.friendService.search(params);

    // Return
    return new ResponseData({ data }, HttpStatus.OK);
  }
}
