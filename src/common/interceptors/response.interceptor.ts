// src/common/interceptors/response.interceptor.ts
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((result: any) => {
        // If already final response, return as-is
        if (
          result &&
          typeof result === 'object' &&
          'statusCode' in result &&
          'message' in result &&
          'data' in result
        ) {
          return result;
        }

        const statusCode = response?.statusCode ?? 200;

        let data = null;
        let message = 'Success';

        // Extract known fields
        if (result) {
          if (result.data) data = result.data;
          else if (typeof result === 'object') data = result;
        }

        if (result?.message) message = result.message;

        // Extract extra fields not inside `data` (ex: token)
        const { ...restFields } = result || {};

        return {
          message,
          statusCode,
          data,
          ...restFields, // this ensures token is placed at root level
        };
      }),
    );
  }
}
