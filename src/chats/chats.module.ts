import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chats, ChatsSchema } from './chats.schema';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports: [
    ConversationsModule,
    MongooseModule.forFeature([{ name: Chats.name, schema: ChatsSchema }]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
