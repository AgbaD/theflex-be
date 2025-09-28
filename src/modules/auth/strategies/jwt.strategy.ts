import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Config } from 'src/config';
import { TokenPayload } from '../dto/auth.dto';
import { findOne } from 'src/libs/db/base.db';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Config.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate({ userId }: TokenPayload) {
    const user = findOne('users', { id: userId });

    if (!user || !user.isVerified) {
      return null;
    }

    return user;
  }
}
