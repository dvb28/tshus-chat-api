import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Friends, FriendsSchema } from './friends.schema';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Friends.name, schema: FriendsSchema }]),
  ],
  providers: [FriendsService],
  exports: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
