import { Logger } from '@nestjs/common';
import {
  IsInt,
  IsString,
  validateSync,
} from 'class-validator';

import { config } from 'dotenv';
config();

class Configuration {
  private readonly logger = new Logger(Configuration.name);

  @IsString()
  readonly PORT = process.env.PORT as string;

  @IsString()
  readonly NODE_ENV = process.env.NODE_ENV as string;

  @IsString()
  readonly JWT_SECRET = process.env.JWT_SECRET as string;

  @IsInt()
  readonly JWT_EXPIRATION = Number(process.env.JWT_EXPIRATION);

  @IsString()
  readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

  @IsInt()
  readonly JWT_REFRESH_EXPIRATION = Number(process.env.JWT_REFRESH_EXPIRATION);

  @IsString()
  readonly MANAGER_EMAIL = process.env.MANAGER_EMAIL as string;

  @IsString()
  readonly MANAGER_PASSWORD = process.env.MANAGER_PASSWORD as string;

  @IsString()
  readonly MANAGER_FIRST_NAME = process.env.MANAGER_FIRST_NAME as string;

  @IsString()
  readonly MANAGER_LAST_NAME = process.env.MANAGER_LAST_NAME as string;

  @IsString()
  readonly HOSTAWAY_ACCOUNT_ID = process.env.HOSTAWAY_ACCOUNT_ID as string;

  @IsString()
  readonly HOSTAWAY_API_KEY = process.env.HOSTAWAY_API_KEY as string;

  @IsString()
  readonly HOSTAWAY_BASE_URL = process.env.HOSTAWAY_BASE_URL as string;

  @IsString()
  readonly GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY as string;

  @IsString()
  readonly GOOGLE_PLACES_BASE_URL = process.env.GOOGLE_PLACES_BASE_URL as string;


  constructor() {
    const error = validateSync(this);

    if (!error.length) return;
    this.logger.error(`Config validation error: ${JSON.stringify(error[0])}`);
    process.exit(1);
  }
}

export const Config = new Configuration();
