import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { HttpResponse } from 'src/libs/common/types/response';
import { LoginDto } from './dto/auth.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly response: HttpResponse,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const resp = await this.authService.login(dto);
    return this.response.okResponse(res, resp?.message, resp?.data);
  }
}
