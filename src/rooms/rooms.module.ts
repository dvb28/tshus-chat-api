import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rooms, RoomsSchema } from './rooms.schema';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { RoomMembersModule } from 'src/roommembers/roommembers.module';

@Module({
  imports: [
    ConversationsModule,
    RoomMembersModule,
    MongooseModule.forFeature([{ name: Rooms.name, schema: RoomsSchema }]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
