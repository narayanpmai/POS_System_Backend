import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (req.body && typeof req.body === 'object') {
      req.body = this.sanitizeObject(req.body);
    }

    if (req.query && typeof req.query === 'object') {
      req.query = this.sanitizeObject(req.query);
    }

    return next.handle();
  }

  private sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      // Strip potential script tags and dangerous HTML injections
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '');
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (obj !== null && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key of Object.keys(obj)) {
        sanitized[key] = this.sanitizeObject(obj[key]);
      }
      return sanitized;
    }

    return obj;
  }
}
