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
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Public } from 'src/common/decorator/auth.decorator';
import { MessagesService } from 'src/messages/messages.service';
import { MessagesDto } from 'src/common/dto/messages/messages.dto';

@UseGuards(AuthGuard)
// Create Websocket Getway
@WebSocketGateway(2820, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messagesService: MessagesService) {}
  @WebSocketServer()
  server: Server;

  handleDisconnect(client: Socket) {
    // Emit
    client.broadcast.emit('callended', client.id);
  }
  handleConnection(client: any) {
    // Emit me
    client.emit('me', client.id);

    client.on('call', (data: any) => {
      // Emit socket
      client.broadcast.emit('call', data);
    });

    client.on('answer-call', (data: any) => {
      // Emit socket
      client.broadcast.emit('call-accepted', data.signalData);
    });
  }

  @Public()
  @SubscribeMessage('chat-message')
  async chats(@MessageBody(new ValidationPipe()) body: MessagesDto) {
    // Exception
    try {
      // Created
      const created = await this.messagesService.create(body);

      // Emit socket
      this.server.emit('chats', created);
    } catch (error) {
      // throw ws exception
      throw new WsException(error.message);
    }
  }

  @Public()
  @SubscribeMessage('join')
  async join(@MessageBody() body: any) {
    // Join to room
    this.server.socketsJoin(body.conversation);
  }
}
