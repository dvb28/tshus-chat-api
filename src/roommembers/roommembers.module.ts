import { Module } from '@nestjs/common';
import { RoomMembersController } from './roommembers.controller';
import { RoomMembersService } from './roommembers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomMembers, RoomMembersSchema } from './roommembers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoomMembers.name, schema: RoomMembersSchema },
    ]),
  ],
  controllers: [RoomMembersController],
  providers: [RoomMembersService],
  exports: [RoomMembersService],
})
export class RoomMembersModule {}
