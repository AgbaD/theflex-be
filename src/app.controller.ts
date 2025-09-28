import { Controller, Get, Res } from '@nestjs/common';
import { HttpResponse } from './libs/common/types/response';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly response: HttpResponse) {}

  // health check
  @Get()
  getHealth(@Res() res: Response) {
    return this.response.okResponse(res, 'Health Check', {
      status: 'OK',
      data: new Date(),
    });
  }
}
