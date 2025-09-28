import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

@Catch(
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
)
export class AllExceptionsFilter implements ExceptionFilter {

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorFormat = {
      error: null,
      message: null,
      statusCode: null,
      success: null,
    };

    errorFormat.success = false;
    errorFormat.statusCode = status;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      // If response is an object, extract the `message` property
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        errorFormat.message =
          (exceptionResponse as any).message ||
          JSON.stringify(exceptionResponse);
      } else {
        errorFormat.message = exceptionResponse as string;
      }
    } else if (exception instanceof Error) {
      // Handle generic JavaScript errors
      errorFormat.message = exception.message;
    }

    return response.status(status).json(errorFormat);
  }
}
