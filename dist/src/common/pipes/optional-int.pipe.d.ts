import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class OptionalIntPipe implements PipeTransform<string, number | undefined> {
    transform(value: any, metadata: ArgumentMetadata): number | undefined;
}
