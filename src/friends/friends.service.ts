import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Friends } from './friends.schema';
import { ErrorStatus } from 'src/common/global/error.status';
import { FriendRequestDto } from 'src/common/dto/user/friend-request';
import { SearchFriendsDto } from 'src/common/dto/friends/search-friend.dto';
import { FriendsStateEnum } from 'src/common/enums/friends-state.enum';
import {
  LoadRequestReqDto,
  LoadRequestResDto,
} from 'src/common/dto/friends/load-request.dto';
import { FriendsActionsDto } from 'src/common/dto/friends/actions.dto';
import { FriendsPageDto } from 'src/common/dto/friends/page.dto';

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
      return await this.create(body);
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

  // Load request friends state
  async load_request(params: LoadRequestReqDto): Promise<LoadRequestResDto> {
    // Exception
    try {
      const query = await this.friendsModel.find({
        $or: [
          { $and: [{ 'friend.user': params.user }, { state: 'PENDING' }] },
          { $and: [{ 'inviter.user': params.user }, { state: 'PENDING' }] },
        ],
      });

      const request = query.filter(
        (r) => r?.friend?.user?.toString() === params.user,
      );
      const sended = query.filter(
        (s) => s?.inviter.user?.toString() === params.user,
      );

      return { request, sended };
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Load friend
  async page(params: FriendsPageDto): Promise<any | undefined> {
    // Exception
    try {
      // Created
      const friend = await this.friendsModel.find({
        $and: [
          {
            $or: [
              { 'inviter.user': params.user },
              { 'friend.user': params.user },
            ],
          },
          { state: 'ACCEPTED' },
          { block: false },
        ],
      });

      const data = {};

      // Data
      friend?.forEach((i) => {
        // Check is inviter
        if (i?.inviter?.user?.toString() === params.user) {
          // Group to
          data[i.friend.nickname.charAt(0).toUpperCase()] = [i?.friend];
        } else {
          // Group to
          data[i.inviter.nickname.charAt(0).toUpperCase()] = [i?.inviter];
        }
      });

      //  Return
      return data;
    } catch (error) {
      // Throw error
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Accept request friend service
  async accept(body: FriendsActionsDto): Promise<FriendsActionsDto> {
    // Exception
    try {
      // Tìm yêu cầu kết bạn ở trạng thái PENDING
      const updated = await this.friendsModel.updateOne(
        { _id: body.id },
        { state: 'ACCEPTED' },
      );

      // Check
      if (!updated) {
        // Throw error
        throw new HttpException(
          'Đồng ý yêu cầu kết bạn không thành công',
          HttpStatus.CONFLICT,
        );
      }

      // Return
      return body;
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // cancel request friend service
  async cancel(body: FriendsActionsDto): Promise<FriendsActionsDto> {
    // Exception
    try {
      // Delete
      const deleted = await this.friendsModel.deleteOne({ _id: body.id });

      // Check
      if (!(deleted && deleted?.deletedCount !== 0)) {
        // Throw error
        throw new HttpException(
          'Huỷ kết bạn không thành công',
          HttpStatus.CONFLICT,
        );
      }

      // Return
      return body;
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }
}
