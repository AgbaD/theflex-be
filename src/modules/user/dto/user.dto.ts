import { PROFILE_TYPE } from "src/libs/db/base.db";

export interface CreateUserDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  type: PROFILE_TYPE;
  isVerified?: boolean;
}