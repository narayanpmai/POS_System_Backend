import { BadRequestException, Injectable, PipeTransform, Optional } from '@nestjs/common';
import { DateConverterService } from '../utils/date-converter.service';

const BS_DATE_FIELDS = [
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
];

@Injectable()
export class BsToAdPipe implements PipeTransform {
  private readonly dateConverter: DateConverterService;

  constructor(@Optional() dateConverter?: DateConverterService) {
    this.dateConverter = dateConverter || new DateConverterService();
  }

  transform(value: any): any {
    if (!value || typeof value !== 'object') return value;

    const transformed = { ...value };

    for (const field of BS_DATE_FIELDS) {
      const val = transformed[field];
      if (val && typeof val === 'string') {
        const trimmed = val.trim();
        // Check if it's a BS date (YYYY-MM-DD where year >= 2050)
        const match = trimmed.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
        if (match && Number(match[1]) >= 2050) {
          try {
            transformed[field] = this.dateConverter.bsToAd(trimmed);
          } catch (err: any) {
            throw new BadRequestException(
              `Invalid BS date for field '${field}': ${trimmed}. Expected format: YYYY-MM-DD`,
            );
          }
        }
      }
    }

    return transformed;
  }
}
