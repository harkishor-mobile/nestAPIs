// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Global exception filter — returns fixed error shape:
 * {
 *   success: false,
 *   statusCode: <number>,
 *   message: "<string>"
 * }
 *
 * For class-validator errors (array), we join them into a single string.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    // Determine status
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Normalize message
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      const exResponse = exception.getResponse();

      // class-validator returns { message: string[] } or others
      if (typeof exResponse === 'string') {
        message = exResponse;
      } else if (Array.isArray((exResponse as any).message)) {
        // join the validation messages into a single string
        message = (exResponse as any).message.join(', ');
      } else if ((exResponse as any).message) {
        // exResponse.message can be string or object
        if (typeof (exResponse as any).message === 'string') {
          message = (exResponse as any).message;
        } else if (Array.isArray((exResponse as any).message)) {
          message = (exResponse as any).message.join(', ');
        } else {
          message = JSON.stringify((exResponse as any).message);
        }
      } else if ((exResponse as any).error) {
        // fallback to error property
        message = (exResponse as any).error;
      }
    } else if (exception && exception.message) {
      message = exception.message;
    }

    // final response shape
    return res.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }
}
