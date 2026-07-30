import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptions');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as any)?.message || 'Internal server error';

    const user = (request as any).user;
    const userEmail = user?.email || 'Anonymous';
    const companyId = user?.companyId || 'N/A';

    this.logger.error(
      `💥 EXCEPTION ${request.method} ${request.url} | Status: ${status} | User: ${userEmail} | Company: ${companyId}`,
    );

    if (exception instanceof Error) {
      if (exception.stack) {
        this.logger.error(`Details: ${exception.message}`);
        this.logger.error(`Stack: ${exception.stack}`);
      }
    } else {
      this.logger.error(`Error Object: ${JSON.stringify(exception)}`);
    }

    const responseMessage =
      typeof message === 'object' && message !== null
        ? (message as any).message || message
        : message;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: responseMessage,
    });
  }
}
