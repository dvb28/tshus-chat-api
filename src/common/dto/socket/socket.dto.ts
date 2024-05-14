import { IsNotEmpty } from 'class-validator';
import { ChaterDTO } from '../user/chater.dto';

export class CallToDto {
  signalData: string;
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: ChaterDTO;

  @IsNotEmpty()
  name: string;
}

export class CallEnDto {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  name: string;
}
