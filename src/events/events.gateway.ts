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
import { CallEnDto, CallToDto } from 'src/common/dto/socket/socket.dto';

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

  handleConnection(client: TshusSocket): void {
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

    client.emit('me', client.id);
  }

  @Public()
  @SubscribeMessage('call:answer')
  async callAnswer(@MessageBody(new ValidationPipe()) body: any) {
    // Exception
    try {
      // Find
      const find = Array.from(this.server.of('/').sockets.values()).find(
        (sk) => (sk as TshusSocket)?.user === body.to,
      );

      // Check to
      if (find) {
        // Emit socket
        this.server.to(find?.id).emit('call:accepted', body.signal);
      } else {
        // throw ws exception
        throw new WsException('Không tìm thấy người dùng');
      }
    } catch (error) {
      // throw ws exception
      throw new WsException(error.message);
    }
  }

  @Public()
  @SubscribeMessage('call:to')
  async callTo(@MessageBody(new ValidationPipe()) body: CallToDto) {
    // Exception
    try {
      // Find
      const find = Array.from(this.server.of('/').sockets.values()).find(
        (sk) => (sk as TshusSocket)?.user === body.to?.user,
      );

      // Check to
      if (find) {
        // Emit socket
        this.server.to(find?.id).emit('call:from', {
          signal: body.signalData,
          from: body.from,
          name: body.name,
        });
      } else {
        // throw ws exception
        throw new WsException('Không tìm thấy người dùng');
      }
    } catch (error) {
      // throw ws exception
      throw new WsException(error.message);
    }
  }

  @Public()
  @SubscribeMessage('call:to:end')
  async callToEnd(@MessageBody(new ValidationPipe()) body: CallEnDto) {
    // Exception
    try {
      // Find
      const find = Array.from(this.server.of('/').sockets.values()).find(
        (sk) => (sk as TshusSocket)?.user === body.to,
      );

      // Check to
      if (find) {
        // Emit socket
        this.server.to(find?.id).emit('call:from:end', {
          from: body.from,
          name: body.name,
        });
      } else {
        // throw ws exception
        throw new WsException('Không tìm thấy người dùng');
      }
    } catch (error) {
      // throw ws exception
      throw new WsException(error.message);
    }
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
