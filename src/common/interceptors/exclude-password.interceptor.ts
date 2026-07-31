import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => this.stripPassword(data))
    );
  }

  private stripPassword(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
      return obj.map(item => this.stripPassword(item));
    }

    if (typeof obj === 'object' && !(obj instanceof Date)) {
      // Handle paginated responses or nested items
      const cleaned: any = {};
      for (const key of Object.keys(obj)) {
        if (key === 'password') continue; // Strip password field
        cleaned[key] = this.stripPassword(obj[key]);
      }
      return cleaned;
    }

    return obj;
  }
}
