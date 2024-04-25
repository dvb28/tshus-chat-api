import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Messages } from './messages.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorStatus } from 'src/common/global/error.status';
import { MessagesPageDto } from 'src/common/dto/messages/message-page.dto';
import { ConversationsService } from 'src/conversations/conversations.service';

// This should be a real class/interface representing a user entity
export type Message = any;

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Messages') private messagesModel: Model<Messages>,
    private cvsService: ConversationsService,
  ) {}

  // Create
  async create(body: any): Promise<Message | undefined> {
    // Exceptionn
    try {
      // Created
      const created = await this.messagesModel.create({
        ...body,
        seenders: [],
      });

      const last_message = await this.cvsService.set_last_message(created);

      // Return
      return { ...created.toJSON(), last_message };
    } catch (error) {
      // throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Transfer
  async transfer(body: any): Promise<Message | undefined> {
    // Exceptionn
    try {
      // Created
      const tranfer = await this.messagesModel.create({
        ...body,
        seenders: [],
        send_at: new Date(),
      });

      // Last message
      const last_message = await this.cvsService.set_last_message(tranfer);

      // Return
      return { ...tranfer.toJSON(), last_message };
    } catch (error) {
      // throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  async page(params: MessagesPageDto): Promise<Message | undefined> {
    // Exceptionn
    try {
      // Limit
      const limit = 15;

      // Skip
      const skip = (params.page - 1) * limit;

      // Finded

      const finded = await this.messagesModel
        .find({ conversation: params.conversation })
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(skip);

      // Return
      return finded;
    } catch (error) {
      // throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }
}
