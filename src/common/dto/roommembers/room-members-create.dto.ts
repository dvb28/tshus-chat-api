import { IsNotEmpty } from 'class-validator';
import { RoomMembersRoleEnum } from 'src/common/enums/room-members-role.enum';
import { ChaterDTO } from '../user/chater.dto';

export class RoomMembersCreateDto {
  @IsNotEmpty()
  member: ChaterDTO;

  role: RoomMembersRoleEnum;
}
