import {
  Controller,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { SearchFriendsDto } from 'src/common/dto/friends/search-friend.dto';
import { Public } from 'src/common/decorator/auth.decorator';
import { ResponseData } from 'src/common/global/response.data';
import { LoadRequestReqDto } from 'src/common/dto/friends/load-request.dto';
import { FriendsPageDto } from 'src/common/dto/friends/page.dto';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendService: FriendsService) {}
  // [ROLE] USER

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

  // [GET] /search
  @Public()
  @HttpCode(200)
  @Get('load_request')
  async load_request(@Query(new ValidationPipe()) params: LoadRequestReqDto) {
    // Load request of user
    const load = await this.friendService.load_request(params);

    // Return
    return new ResponseData({ data: load }, HttpStatus.OK);
  }

  // [GET] /page
  @Public()
  @HttpCode(200)
  @Get('page')
  async page(@Query(new ValidationPipe()) params: FriendsPageDto) {
    // Load page data
    const page = await this.friendService.page(params);

    // Return
    return new ResponseData({ data: page }, HttpStatus.OK);
  }
}
