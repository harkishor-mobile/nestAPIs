// src/common/errors/app-error.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational = true;
  public readonly details?: any;

  constructor(message: string, statusCode = 400, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
