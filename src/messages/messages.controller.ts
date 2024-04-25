import {
  Post,
  Get,
  Query,
  HttpCode,
  Controller,
  HttpStatus,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
  HttpException,
  Body,
} from '@nestjs/common';
import { storageConfig } from 'src/helpers/storage';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MessagesService } from './messages.service';
import { ResponseData } from 'src/common/global/response.data';
import { MessagesPageDto } from 'src/common/dto/messages/message-page.dto';
import { ErrorStatus } from 'src/common/global/error.status';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  // [ROLE] USER
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files[]', 10, { storage: storageConfig('files') }),
  )
  async upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    // Return
    return new ResponseData({ data: files }, HttpStatus.OK);
  }

  // [POST] transfer
  @Post('transfer')
  @HttpCode(200)
  async transfer(@Body() body: any) {
    // Exception
    try {
      // Tranfer message
      const tranfer = await this.messagesService.transfer(body);

      // Return
      return new ResponseData({ data: tranfer }, HttpStatus.OK);
    } catch (error) {
      // throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // [GET] page
  @HttpCode(200)
  @Get('page')
  async page(@Query(new ValidationPipe()) params: MessagesPageDto) {
    // Exception
    try {
      // Get page
      const page = await this.messagesService.page(params);

      // Return
      return new ResponseData({ data: page }, HttpStatus.OK);
    } catch (error) {
      // throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }
}
