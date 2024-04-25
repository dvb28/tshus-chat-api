import { IsEnum, IsMongoId, IsString } from 'class-validator';
import mongoose from 'mongoose';

enum FindUserTypeEnum {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
}

export class FindUsersDto {
  @IsMongoId()
  user: mongoose.Types.ObjectId;

  @IsString()
  search: string;

  @IsEnum(FindUserTypeEnum)
  type: FindUserTypeEnum;
}
