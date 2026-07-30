import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const { method, originalUrl, ip } = req;
    const user = (req as any).user;
    const userInfo = user ? `[User: ${user.email} (Company: ${user.companyId})]` : '[Guest]';

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `📥 ${method} ${originalUrl} ${res.statusCode} OK - ${duration}ms ${userInfo} (IP: ${ip})`,
          );
        },
        error: (err) => {
          const duration = Date.now() - startTime;
          const status = err?.status || res.statusCode || 500;
          this.logger.warn(
            `⚠️ ${method} ${originalUrl} ${status} FAILED - ${duration}ms ${userInfo} | ${err?.message || 'Error'}`,
          );
        },
      }),
    );
  }
}
