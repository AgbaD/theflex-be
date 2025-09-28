import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { db, findOne, save, User } from 'src/libs/db/base.db';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private nextUserId(): number {
    const ids = db.users.map(u => u.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  private sanitize(user: User) {
    const { password, ...rest } = user;
    return rest;
  }

  createProfile(createUserDto: CreateUserDto) {
    const email = createUserDto.email ? this.normalizeEmail(createUserDto.email) : '';
    if (!email) throw new BadRequestException('Email is required');

    const existing = findOne('users', u => this.normalizeEmail(u.email) === email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser: User = {
      id: this.nextUserId(),
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      email,
      password: createUserDto.password,
      type: createUserDto.type,
      isVerified: createUserDto.isVerified ?? true,
    };

    const saved = save('users', newUser);
    return {
      data: this.sanitize(saved),
      message: 'User created successfully',
    };
  }

  getProfileById(userId: number) {
    const user = findOne('users', { id: userId });
    if (!user) throw new NotFoundException('user with Id not found');

    return {
      data: this.sanitize(user),
      message: 'user retrieved successfully',
    };
  }
}
