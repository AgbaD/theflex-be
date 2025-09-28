import { Injectable } from '@nestjs/common';
import { Config } from 'src/config';
import { UserService } from './modules/user/user.service';
import { CreateUserDto } from './modules/user/dto/user.dto';
import { PROFILE_TYPE } from './libs/db/base.db';
import { loadDbFromDisk } from './libs/db/base.db';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService
  ) {}

  async onApplicationBootstrap() {
    loadDbFromDisk();
    await this.createManagerAccount();
  }

  async createManagerAccount() {
    try {
      const managerEmail = Config.MANAGER_EMAIL;
      const managerPassword = Config.MANAGER_PASSWORD;
      const managerFirstName = Config.MANAGER_FIRST_NAME;
      const managerLastName = Config.MANAGER_LAST_NAME;
      
      const payload: CreateUserDto = {
        firstname: managerFirstName,
        lastname: managerLastName,
        email: managerEmail,
        password: managerPassword,
        type: PROFILE_TYPE.MANAGER,
        isVerified: true,
      }
      const manager = await this.userService.createProfile(payload)
      console.log("---------------------------")
      console.log("manager created successfully")
      console.log("---------------------------")

    } catch (error) {
      console.log("---------------------------")
      console.log("manager already exists")
      console.log("---------------------------")
      // console.log(error)
    }

  }
}
