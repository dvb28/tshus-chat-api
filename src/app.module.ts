import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guard/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { MessagesController } from './messages/messages.controller';
import { EventsModule } from './events/events.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomMembersModule } from './roommembers/roommembers.module';
import { ChatsModule } from './chats/chats.module';
import { FriendsModule } from './friends/friends.module';
import { RolesGuard } from './common/guard/roles.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RoomsModule,
    ChatsModule,
    EventsModule,
    FriendsModule,
    MessagesModule,
    RoomMembersModule,
    ConversationsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      // 'mongodb+srv://tshus:daovietbao@tshus.5uprpvf.mongodb.net/?retryWrites=true&w=majority&appName=tshus',
      'mongodb://root:vietbao@localhost:27017/',
      { dbName: 'tshus' },
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController, MessagesController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
