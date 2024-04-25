import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { RoomMembersService } from './roommembers.service';
import { ResponseData } from 'src/common/global/response.data';
import { ErrorStatus } from 'src/common/global/error.status';
import { RoomPageDto } from 'src/common/dto/rooms/room-page.dto';
import { RoomMembersDeleteDto } from 'src/common/dto/roommembers/room-members-delete.dto';
import { RoomMembersAddDto } from 'src/common/dto/roommembers/room-members-add.dto';

@Controller('roommembers')
export class RoomMembersController {
  constructor(private readonly roommembers: RoomMembersService) {}
  // [GET] page
  @HttpCode(200)
  @Get('page')
  async page(@Query(new ValidationPipe()) params: RoomPageDto) {
    // Exception
    try {
      // Get page
      const page = await this.roommembers.page(params);

      // Return
      return new ResponseData({ data: page }, HttpStatus.OK);
    } catch (error) {
      // throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // [GET] page
  @HttpCode(200)
  @Delete('delete')
  async delete(@Query(new ValidationPipe()) params: RoomMembersDeleteDto) {
    // Exception
    try {
      // Get page
      const page = await this.roommembers.delete(params);

      // Return
      return new ResponseData({ data: page }, HttpStatus.OK);
    } catch (error) {
      // throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // [GET] page
  @HttpCode(200)
  @Post('add')
  async add(@Body(new ValidationPipe()) body: RoomMembersAddDto) {
    // Exception
    try {
      // Get page
      const page = await this.roommembers.add(body);

      // Return
      return new ResponseData({ data: page }, HttpStatus.OK);
    } catch (error) {
      // throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }
}
