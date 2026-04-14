import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from '../exceptions/app.exception';

type HttpExceptionResponseShape = {
  message?: string | string[];
  errors?: Record<string, string>;
};

function toMessage(value: string | string[] | undefined, fallback: string): string {
  if (typeof value === 'string' && value.length) return value;
  if (Array.isArray(value) && value.length) return value.join(', ');
  return fallback;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: Record<string, string> | undefined;

    if (exception instanceof AppException) {
      statusCode = exception.statusCode;
      message = exception.message;
      errors = exception.errors;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const { message: exceptionMessage, errors: exceptionErrors } =
        exceptionResponse as HttpExceptionResponseShape;
      message = toMessage(exceptionMessage, exception.message);
      if (exceptionErrors) {
        errors = exceptionErrors;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(message, exception.stack);
    }

    this.logger.warn(`${request.method} ${request.url} - ${statusCode} - ${message}`);

    const errorResponse = {
      statusCode,
      message,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(errorResponse);
  }
}
