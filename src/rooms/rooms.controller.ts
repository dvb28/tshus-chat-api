import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ErrorStatus } from 'src/common/global/error.status';
import { ResponseData } from 'src/common/global/response.data';
import { RoomCreateDto } from 'src/common/dto/rooms/room-create.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}
  @Post('create')
  @HttpCode(201)
  async create(@Body(new ValidationPipe()) body: RoomCreateDto) {
    // Exception
    try {
      // Create Room
      const created = await this.roomsService.create(body);

      // Return
      return new ResponseData({ data: created }, HttpStatus.OK);
    } catch (error) {
      // throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }
}
