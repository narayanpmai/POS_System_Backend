import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class OptionalIntPipe implements PipeTransform<string, number | undefined> {
  transform(value: any, metadata: ArgumentMetadata): number | undefined {
    if (value === undefined || value === null || value === '' || value === 'undefined' || value === 'null' || (typeof value === 'number' && isNaN(value))) {
      return undefined;
    }
    if (typeof value === 'object') {
      return undefined;
    }
    const val = typeof value === 'number' ? value : parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(`${metadata.data} must be a number`);
    }
    return val;
  }
}
