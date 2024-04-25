import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Messages, MessagesSchema } from './messages.schema';
import { MessagesService } from './messages.service';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports: [
    ConversationsModule,
    MongooseModule.forFeature([
      { name: Messages.name, schema: MessagesSchema },
    ]),
  ],
  providers: [MessagesService],
  exports: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
