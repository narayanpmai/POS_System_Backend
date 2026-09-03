import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateConverterService } from '../utils/date-converter.service';
import { SKIP_DATE_TRANSFORM_KEY } from '../decorators/skip-date-transform.decorator';

@Injectable()
export class BsDateTransformInterceptor implements NestInterceptor {
  constructor(
    private readonly dateConverter: DateConverterService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_DATE_TRANSFORM_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skip) return next.handle();

    return next.handle().pipe(
      map((data) => {
        if (!data) return data;
        // Never transform binary/file responses
        if (data instanceof StreamableFile) return data;
        if (Buffer.isBuffer(data)) return data;
        if (data instanceof Uint8Array) return data;
        return this.transformDates(data);
      }),
    );
  }

  private transformDates(obj: any, visited = new WeakSet(), depth = 0): any {
    // Guard: max recursion depth
    if (depth > 25) return obj;

    // Guard: primitives
    if (!obj || typeof obj !== 'object') return obj;

    // Guard: Date instances - convert directly
    if (obj instanceof Date) {
      try {
        return this.dateConverter.adToBs(obj);
      } catch {
        return obj.toISOString();
      }
    }

    // Guard: circular references
    if (visited.has(obj)) return obj;
    visited.add(obj);

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformDates(item, visited, depth + 1));
    }

    // Handle standard response wrapper { success, message, data }
    if (obj.data !== undefined) {
      return {
        ...obj,
        data: this.transformDates(obj.data, visited, depth + 1),
      };
    }

    const transformed = { ...obj };

    // Known date fields in Koselighar to transform into BS format
    const dateFields = [
      'date',
      'purchaseDate',
      'saleDate',
      'returnDate',
      'startDate',
      'endDate',
      'fromDate',
      'toDate',
      'dueDate',
      'entryDate',
      'createdAt',
      'updatedAt',
    ];

    for (const key of Object.keys(transformed)) {
      const value = transformed[key];

      if (value === null || value === undefined) {
        continue;
      }

      if (dateFields.includes(key)) {
        try {
          let date: Date;

          if (value instanceof Date) {
            date = value;
          } else if (typeof value === 'string') {
            const trimmed = value.trim();
            const yearMatch = trimmed.match(/^(\d{4})-\d{2}-\d{2}/);
            if (yearMatch && Number(yearMatch[1]) >= 2050) {
              // Already in BS format
              transformed[key] = trimmed;
              continue;
            }
            date = new Date(trimmed);
          } else {
            continue;
          }

          if (!isNaN(date.getTime())) {
            transformed[key] = this.dateConverter.adToBs(date);
          }
        } catch {
          transformed[key] = value;
        }
      } else if (typeof value === 'object') {
        transformed[key] = this.transformDates(value, visited, depth + 1);
      }
    }

    return transformed;
  }
}
