import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Config } from 'src/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HttpResponse } from 'src/libs/common/types/response';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: Config.JWT_SECRET,
        signOptions: {
          expiresIn: `${Config.JWT_EXPIRATION}s`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    HttpResponse,
  ],
  exports: [AuthService],
})
export class AuthModule {}
