import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversations, ConversationsSchema } from './conversations.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversations.name, schema: ConversationsSchema },
    ]),
  ],
  providers: [ConversationsService],
  exports: [ConversationsService],
  controllers: [ConversationsController],
})
export class ConversationsModule {}
