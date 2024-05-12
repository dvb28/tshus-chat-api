import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ValidationPipe } from '@nestjs/common';
import { Public } from 'src/common/decorator/auth.decorator';
import { MessagesService } from 'src/messages/messages.service';
import { MessagesDto } from 'src/common/dto/messages/messages.dto';
import { FriendRequestDto } from 'src/common/dto/user/friend-request';
import { FriendsService } from 'src/friends/friends.service';
import { FriendsActionsDto } from 'src/common/dto/friends/actions.dto';
import { FriendsActionsEnum } from 'src/common/enums/friends-actions.enum';

interface TshusSocket extends Socket {
  user: string;
}

// Create Websocket Getway
@WebSocketGateway(2820, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly friendsService: FriendsService,
  ) {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.use((socket: TshusSocket, next) => {
      // User ID
      const user = socket?.handshake?.auth?.user;

      // Check user is valid
      if (!user) {
        return next(new Error('Người dùng không tồn tại'));
      }
      // Set socket user
      socket.user = user;

      // Next
      next();
    });
  }

  handleDisconnect(socket: Socket) {
    // Users list
    const users = [];

    // For loop
    for (const [id, socket] of this.server.of('/').sockets) {
      // Push to user
      users.push({
        clientID: id,
        user: (socket as TshusSocket)?.user,
      });
    }

    // Users
    this.server.emit('users', users);

    // Emit
    socket.broadcast.emit('callEnded');
  }

  handleConnection(socket: TshusSocket): void {
    // Users list
    const users = [];

    // For loop
    for (const [id, socket] of this.server.of('/').sockets) {
      // Push to user
      users.push({
        clientID: id,
        user: (socket as TshusSocket)?.user,
      });
    }

    // Users
    this.server.emit('users', users);

    // Emit me
    socket.emit('me', socket.id);

    // Event
    socket.on('callUser', (data: any) => {
      // Emit socket
      this.server.to(data.userToCall).emit('callUser', {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      });
    });

    // Events
    socket.on('answerCall', (data: any) => {
      // Emit socket
      this.server.to(data.to).emit('callAccepted', data.signal);
    });
  }

  @Public()
  @SubscribeMessage('chat:server')
  async chats(@MessageBody(new ValidationPipe()) body: MessagesDto) {
    // Exception
    try {
      // Created
      const created = await this.messagesService.create(body);

      // Emit socket
      this.server.emit('chat:client', created);
    } catch (error) {
      // throw ws exception
      throw new WsException(error.message);
    }
  }

  @Public()
  @SubscribeMessage('friend-server')
  async friend(@MessageBody(new ValidationPipe()) body: FriendRequestDto) {
    // Exception
    try {
      // Created
      const created = await this.friendsService.send(body);

      // Emit socket
      this.server.emit('friend-client', created);
    } catch (error) {
      // throw ws exception
      throw new WsException(error.message);
    }
  }

  @Public()
  @SubscribeMessage('friend_actions_server')
  async friend_actions_server(
    @MessageBody(new ValidationPipe()) body: FriendsActionsDto,
  ) {
    // Exception
    try {
      // Check friend actions
      if (body.action === FriendsActionsEnum.ACCEPT) {
        // Update
        const updated = await this.friendsService.accept(body);

        // Emit socket
        this.server.emit('friend_actions_client', updated);
      } else {
        // Update
        const deleted = await this.friendsService.cancel(body);

        // Emit socket
        this.server.emit('friend_actions_client', deleted);
      }
    } catch (error) {
      // throw ws exception
      throw new WsException(error.message);
    }
  }
}
