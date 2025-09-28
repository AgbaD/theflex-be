import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { PROFILE_TYPE } from 'src/libs/db/base.db';

export class LoginDto {
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}


export interface TokenPayload {
  userId: number;
  type: PROFILE_TYPE;
}

