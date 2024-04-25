import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rooms } from './rooms.schema';
import { ErrorStatus } from 'src/common/global/error.status';
import { RoomCreateDto } from 'src/common/dto/rooms/room-create.dto';
import { ConversationsService } from 'src/conversations/conversations.service';
import { RoomMembersService } from 'src/roommembers/roommembers.service';

// This should be a real class/interface representing a user entity
export type Room = any;

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel('Rooms') private roomsModel: Model<Rooms>,
    private cvsService: ConversationsService,
    private roomMembersServices: RoomMembersService,
  ) {}

  // Create Room
  async create(body: RoomCreateDto): Promise<Room | undefined> {
    // Exception
    try {
      // Create conversation
      const cvs_created = await this.cvsService.create({ type: 'ROOMS' });

      // Check conversation is created
      if (cvs_created) {
        // Create Room
        const created_room = await this.roomsModel.create({
          name: body.name,
          image: body.image,
          conversation: cvs_created._id,
          members_count: body.members.length + 1,
        });

        // Check created room
        if (created_room) {
          // Add members
          const add_room_members = await this.roomMembersServices.create(
            created_room._id,
            body.creater,
            body.members,
          );

          // Return
          return add_room_members;
        }
      }
    } catch (error) {
      // Throw Error
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }
}
