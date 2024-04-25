import { IsNotEmpty } from 'class-validator';

export class RoomMembersDeleteDto {
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  member: string;
}
