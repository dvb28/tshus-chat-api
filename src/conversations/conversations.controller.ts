import {
  Get,
  Query,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ErrorStatus } from 'src/common/global/error.status';
import { ResponseData } from 'src/common/global/response.data';
import { ConversationsService } from './conversations.service';
import { CvsSearchDto } from 'src/common/dto/conversations/cvs-search.dto';
import { CvsPageDto } from 'src/common/dto/conversations/cvs-page.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly cvsService: ConversationsService) {}
  // [ROLE] USER

  // [GET] page
  @HttpCode(200)
  @Get('page')
  async page(@Query(new ValidationPipe()) params: CvsPageDto) {
    // Exception
    try {
      // Get page
      const page = await this.cvsService.page(params);

      // Return
      return new ResponseData({ data: page }, HttpStatus.OK);
    } catch (error) {
      // throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // [GET] search
  @HttpCode(200)
  @Get('search')
  async search(@Query(new ValidationPipe()) params: CvsSearchDto) {
    // Exception
    try {
      // search result
      const search = await this.cvsService.search(params);

      // Return
      return new ResponseData({ data: search }, HttpStatus.OK);
    } catch (error) {
      // throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }
}
