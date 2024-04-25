import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ErrorStatus } from 'src/common/global/error.status';
import { Conversations } from './conversations.schema';
import { ConversationsEnum } from 'src/common/enums/conversations.enum';
import { CvsSearchDto } from 'src/common/dto/conversations/cvs-search.dto';
import { CvsPageDto } from 'src/common/dto/conversations/cvs-page.dto';
import { MessagesType } from 'src/common/enums/messages-type.enum';

// This should be a real class/interface representing a user entity
export type Conversation = any;
export type Message = any;

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel('Conversations') private cvsModel: Model<Conversations>,
  ) {}

  // Get
  async get(params: { _id: string }): Promise<Conversation | undefined> {
    // Exception
    try {
      // Return
      return await this.cvsModel.findOne({ _id: params?._id });
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Search
  async search(params: CvsSearchDto): Promise<Conversation | undefined> {
    // Exception
    try {
      return params;
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Page
  async page(params: CvsPageDto): Promise<Conversation[] | []> {
    // Exception
    try {
      const limit = 10;

      const finded = await this.cvsModel.aggregate([
        {
          $lookup: {
            as: 'chats',
            from: 'chats',
            localField: '_id',
            foreignField: 'conversation',
            let: { conversationId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      {
                        $and: [
                          { $eq: ['$conversation', '$$conversationId'] },
                          {
                            $eq: [
                              '$inviter.user',
                              new mongoose.Types.ObjectId(params.user),
                            ],
                          },
                        ],
                      },
                      {
                        $and: [
                          { $eq: ['$conversation', '$$conversationId'] },
                          {
                            $eq: [
                              '$friend.user',
                              new mongoose.Types.ObjectId(params.user),
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'rooms',
            as: 'rooms',
            localField: '_id',
            foreignField: 'conversation',
            pipeline: [
              {
                $lookup: {
                  from: 'roommembers',
                  let: { roomId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ['$room', '$$roomId'] },
                            {
                              $eq: [
                                '$user',
                                new mongoose.Types.ObjectId(params.user),
                              ],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  as: 'roommembers',
                },
              },
              {
                $match: {
                  roommembers: { $not: { $size: 0 } },
                },
              },
            ],
          },
        },
        {
          $match: {
            $expr: {
              $not: {
                $and: [
                  {
                    $and: [{ $eq: ['$chats', []] }, { $eq: ['$rooms', []] }],
                  },
                ],
              },
            },
          },
        },
        { $limit: limit },
        { $skip: (params.page - 1) * limit },
      ]);

      // Return
      return finded;
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Get with reference
  async getWithRef(params: {
    _id: string;
    type: ConversationsEnum;
  }): Promise<Conversation | undefined> {
    // Exception
    try {
      // Match type
      const type = params?.type.toLowerCase();

      const finded = await this.cvsModel.aggregate([
        { $match: { _id: params?._id } },
        {
          $lookup: {
            as: type,
            from: type,
            localField: '_id',
            foreignField: 'conversation',
          },
        },
      ]);

      // Return
      return finded[0];
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Create
  async create(body: any): Promise<Conversation | undefined> {
    // Exception
    try {
      // Created
      const created = await this.cvsModel.create({
        type: body?.type,
        created_at: new Date(),
      });

      // Return
      return created;
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }
  // Join
  async join(
    body: any,
    withRef: boolean = false,
  ): Promise<Conversation | undefined> {
    // Exception
    try {
      // Get conversation
      const cvs = withRef
        ? await this.getWithRef(body)
        : await this.get(body?._id);

      if (cvs) return cvs;

      const created = await this.create({ type: body?.type });

      if (!withRef) return created;

      // Return
      return await this.getWithRef({
        _id: created?._id,
        type: created?.type,
      });
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Check type and render mes
  render_last_message(mes: Message) {
    // Sender lastname
    const lastname = mes.sender?.nickname?.split(' ')[1];

    // Swithcare
    switch (mes.type) {
      case MessagesType.FILES:
        return `${lastname} đã gửi ${mes.files.length} tệp tin.`;
      case MessagesType.VOICE:
        return `${lastname} đã gửi tin nhắn thoại.`;
      default:
        // Return
        return `${lastname}: ${mes.messages}`;
    }
  }

  // Set last message
  async set_last_message(message: Message): Promise<Conversation> {
    // Exception
    try {
      // Message text
      const text = this.render_last_message(message);

      // Return
      await this.cvsModel.updateOne(
        { _id: message.conversation },
        { last_message: text, last_send: message.send_at },
      );

      // Return
      return text;
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }
}
