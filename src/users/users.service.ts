import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.schema';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/common/dto/sign/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { FindUsersDto } from 'src/common/dto/user/find-user.dto';
import { ErrorStatus } from 'src/common/global/error.status';
import { UsersDto } from 'src/common/dto/user/users.dto';
import { FriendsService } from 'src/friends/friends.service';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(
    private friendsService: FriendsService,
    @InjectModel('Users') private usersModel: Model<Users>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    // Return
    return await this.usersModel.findOne({ email }).exec();
  }

  async findByType(query: FindUsersDto): Promise<any> {
    // Find type
    const type = query.type.toLowerCase();

    // Match find condition
    const match = { [type]: query.search, _id: { $ne: query.user } };

    // Exception
    try {
      // Find user
      const finded = await this.usersModel.findOne(match).exec();

      // Check finded
      if (!finded) return null;

      const friend = await this.friendsService.check(
        query.user.toString(),
        finded._id.toString(),
      );

      // Return
      return { ...new UsersDto(finded), ...friend };
    } catch (e) {
      // Throw error
      throw new HttpException(e.message, ErrorStatus(e));
    }
  }

  async create(signUpData: SignUpDto): Promise<User | undefined> {
    // Created
    const created = await this.usersModel.create({
      ...signUpData,
      password: await bcrypt.hash(signUpData.password, 10),
    });

    // Save to database
    await created.save();

    // Return
    return created;
  }
}
