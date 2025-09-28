import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Config } from 'src/config';
import { findOne, User } from 'src/libs/db/base.db';
import { TokenPayload, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto) {
    const key = String(dto.email || '').trim().toLowerCase();
    if (!key) throw new BadRequestException('Email is required');
    if (!dto.password) throw new BadRequestException('Password is required');

    const user = findOne('users', (u) => u.email.trim().toLowerCase() === key);

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException(`${key} has not been verified`);
    }

    const ok = dto.password === user.password;
    if (!ok) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    const tokenPayload: TokenPayload = { userId: user.id, type: user.type };
    const token = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    const s_user = this.sanitizeUser(user);

    return {
      data: { user: s_user, token, refreshToken },
      message: 'authentication successful',
    };
  }

  private sanitizeUser(user: User) {
    const { password, ...safe } = user;
    return safe;
  }

  private generateAccessToken(tokenPayload: TokenPayload) {
    return this.jwtService.sign(tokenPayload, {
      secret: Config.JWT_SECRET,
      expiresIn: Config.JWT_EXPIRATION,
    });
  }

  private generateRefreshToken(tokenPayload: TokenPayload) {
    return this.jwtService.sign(tokenPayload, {
      secret: Config.JWT_REFRESH_SECRET,
      expiresIn: Config.JWT_REFRESH_EXPIRATION,
    });
  }
}
