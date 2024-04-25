import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RoomMembers } from './roommembers.schema';
import mongoose, { Model } from 'mongoose';
import { ErrorStatus } from 'src/common/global/error.status';
import { RoomMembersCreateDto } from 'src/common/dto/roommembers/room-members-create.dto';
import { RoomPageDto } from 'src/common/dto/rooms/room-page.dto';
import { RoomMembersDeleteDto } from 'src/common/dto/roommembers/room-members-delete.dto';
import { RoomMembersRoleEnum } from 'src/common/enums/room-members-role.enum';
import { RoomMembersAddDto } from 'src/common/dto/roommembers/room-members-add.dto';

type RoomMember = any;

@Injectable()
export class RoomMembersService {
  constructor(
    @InjectModel('RoomMembers') private roomMembersModel: Model<RoomMembers>,
  ) {}

  async check_role(
    user: any,
    role: RoomMembersRoleEnum,
  ): Promise<RoomMember | undefined> {
    // Exception
    try {
      // Return
      return await this.roomMembersModel.findOne({
        user: new mongoose.Types.ObjectId(user),
        role,
      });
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Add member services
  async create(
    room: any,
    creater: RoomMembersCreateDto,
    members: Array<RoomMembersCreateDto>,
  ): Promise<RoomMember | undefined> {
    // Map insert data
    const data = members.map((member) => ({
      room: room,
      user: member.member.user,
      nickname: member.member.nickname,
      role: member.role,
    }));

    // Exception
    try {
      // Created
      const insert = await this.roomMembersModel.insertMany([
        {
          room: room,
          user: creater.member.user,
          nickname: creater.member.nickname,
          role: creater.role,
        },
        ...data,
      ]);

      // Create
      return insert;
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  // Add member services
  async add(body: RoomMembersAddDto): Promise<RoomMember | undefined> {
    // Exception
    try {
      // Finded
      const finded = await this.check_role(
        body.user,
        RoomMembersRoleEnum.MANAGER,
      );

      // Check finded
      if (finded) {
        // Delete
        return await this.roomMembersModel.create({
          nickname: body.member.member.nickname,
          user: body.member.member.user,
          room: body.room,
          role: body.member.role,
        });
      } else {
        // Throw http exception
        throw new HttpException(
          'Bạn không có quyền thêm thành viên',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      // Throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  async delete(params: RoomMembersDeleteDto): Promise<RoomMember | undefined> {
    // Exceptionn
    try {
      // Finded
      const finded = await this.check_role(
        params.user,
        RoomMembersRoleEnum.MANAGER,
      );

      // Check finded
      if (finded) {
        // Delete
        return await this.roomMembersModel.deleteOne({
          _id: new mongoose.Types.ObjectId(params.member),
        });
      } else {
        // Throw http exception
        throw new HttpException(
          'Bạn không có quyền đuổi thành viên',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      // throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }

  async page(params: RoomPageDto): Promise<RoomMember | undefined> {
    // Exceptionn
    try {
      // Finded
      const finded = await this.roomMembersModel.find({ room: params.room });

      // Return
      return finded;
    } catch (error) {
      // throw http exception
      throw new HttpException(error.message, ErrorStatus(error));
    }
  }
}
