import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Friends } from './friends.schema';
import { ErrorStatus } from 'src/common/global/error.status';
import { FriendRequestDto } from 'src/common/dto/user/friend-request';
import { SearchFriendsDto } from 'src/common/dto/friends/search-friend.dto';
import { FriendsStateEnum } from 'src/common/enums/friends-state.enum';

export type Friend = any;

@Injectable()
export class FriendsService {
  constructor(@InjectModel('Friends') private friendsModel: Model<Friends>) {}

  async create(body: any): Promise<Friend | undefined> {
    // Exception
    try {
      // Created
      const friend: Friends = await this.friendsModel.create(body);

      //  Return
      return friend;
    } catch (error) {
      // Throw Error
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Service PENDING friend request
  async send(body: FriendRequestDto): Promise<void> {
    // Exception
    try {
      // Check friend is exists
      const friend = await this.friendsModel.findOne({
        'inviter.user': body.inviter.user,
        'friend.user': body.friend.user,
      });

      // Throw error if friend is exists
      if (friend) throw new HttpException('Đã kết bạn', HttpStatus.CONFLICT);

      // Created
      await this.create(body);
    } catch (error) {
      // Throw Error
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Check 2 user is friend
  async check(inviter: string, friend: string): Promise<Friend | undefined> {
    // Exception
    try {
      const isFriend = await this.friendsModel.findOne({
        $or: [
          {
            $and: [{ 'inviter.user': inviter }, { 'friend.user': friend }],
          },
          {
            $and: [{ 'inviter.user': friend }, { 'friend.user': inviter }],
          },
        ],
      });

      // Check is sender
      const isSender = isFriend?.inviter?.user?.toString() === inviter;

      // Return
      return {
        state: isFriend ? isFriend.state : FriendsStateEnum.NOTYET,
        isSender: isSender,
      };
    } catch (error) {
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Search friend of user
  async search(params: SearchFriendsDto): Promise<any | undefined> {
    // Exception
    try {
      // Exception
      const finded = await this.friendsModel
        .find({
          $and: [
            {
              $or: [
                { 'inviter.nickname': params.search },
                { 'friend.nickname': params.search },
              ],
            },
            {
              'inviter.user': new mongoose.Types.ObjectId(params.inviter),
            },
            { state: FriendsStateEnum.ACCEPTED },
            { block: false },
          ],
        })
        .limit(params.limit);

      // Return
      return finded;
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }
}
