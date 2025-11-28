// src/common/filters/http-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Normalize validation error response
    if (typeof message === 'object' && message) {
      return message; // may be string or array
    }

    // Always return same structure
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }
}
