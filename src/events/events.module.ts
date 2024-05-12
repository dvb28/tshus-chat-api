import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MessagesModule } from 'src/messages/messages.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  imports: [MessagesModule, FriendsModule],
  providers: [EventsGateway],
})
export class EventsModule {}
