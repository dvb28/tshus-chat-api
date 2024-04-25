import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chats } from './chats.schema';
import { ConversationsService } from 'src/conversations/conversations.service';
import { ErrorStatus } from 'src/common/global/error.status';
import { ConversationsEnum } from 'src/common/enums/conversations.enum';
import { JoinDto } from 'src/common/dto/chats/chats-join.dto';

// This should be a real class/interface representing a user entity
export type Chat = any;
export type Conversation = any;

@Injectable()
export class ChatsService {
  constructor(
    private cvsService: ConversationsService,
    @InjectModel('Chats') private chatsModel: Model<Chats>,
  ) {}

  // Get
  async get(body: {
    inviter: string;
    friend: string;
  }): Promise<Chat | undefined> {
    // Exception
    try {
      // Find
      return await this.chatsModel.findOne({
        'inviter.user': body.inviter,
        'friend.user': body.friend,
      });
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Join
  async join(body: JoinDto) {
    // Chat type
    const type = ConversationsEnum.CHATS;

    // Find chat
    const finded = await this.get({
      inviter: body.inviter.user,
      friend: body.friend.user,
    });

    let _id = finded?.conversation;

    if (!finded) {
      // Joined conversation
      const joinedCvs = await this.cvsService.join({ type });

      // Assign conversation
      _id = joinedCvs?._id.toString();

      // Create chats
      await this.chatsModel.create({
        conversation: _id,
        friend: body.friend,
        inviter: body.inviter,
        created_at: new Date(),
      });
    }

    // Return
    return this.cvsService.getWithRef({ _id, type });
  }
}
