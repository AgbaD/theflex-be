import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class HttpResponse {
  okResponse(res: Response, message: string, data?: any) {
    return res.status(HttpStatus.OK).send({
      success: true,
      statusCode: HttpStatus.OK,
      message,
      data,
    });
  }
}
