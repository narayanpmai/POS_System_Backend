import { BadRequestException, Injectable } from '@nestjs/common';
import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter';

@Injectable()
export class DateConverterService {
  bsToAd(bsDate: string): Date {
    try {
      if (!bsDate) {
        throw new BadRequestException('BS date is required');
      }

      // Handle if already converted to ISO string accidentally
      if (bsDate.includes('T') || bsDate.includes('Z')) {
        throw new BadRequestException(
          'Date appears to already be in AD format. Please provide BS date in YYYY-MM-DD format',
        );
      }

      // Split string by - or /
      const parts = bsDate.trim().split(/[-\/]/);
      if (parts.length !== 3) {
        throw new BadRequestException(
          'Invalid BS date format. Expected YYYY-MM-DD',
        );
      }

      const year = Number(parts[0]);
      const month = Number(parts[1]);
      const day = Number(parts[2]);

      if (
        isNaN(year) ||
        isNaN(month) ||
        isNaN(day) ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 32 ||
        year < 2000 ||
        year > 2200
      ) {
        throw new BadRequestException(
          `Invalid BS date values: ${year}-${month}-${day}`,
        );
      }

      // Convert BS to AD using the library
      const formattedBsDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const adDateResult = bsToAd(formattedBsDate);

      // Handle the return type (could be string or object)
      let adDateStr: string;
      if (typeof adDateResult === 'string') {
        adDateStr = adDateResult;
      } else if (
        adDateResult &&
        typeof adDateResult === 'object' &&
        'year' in adDateResult
      ) {
        const obj = adDateResult as any;
        adDateStr = `${obj.year}-${String(obj.month).padStart(2, '0')}-${String(obj.day).padStart(2, '0')}`;
      } else {
        throw new BadRequestException(
          `Could not convert BS date: ${year}-${month}-${day}`,
        );
      }

      // Parse the AD date string (format: YYYY-MM-DD)
      const adParts = adDateStr.split('-');
      if (adParts.length !== 3) {
        throw new BadRequestException(`Invalid AD date format: ${adDateStr}`);
      }

      // Create date in UTC to avoid timezone shifts
      const adDate = new Date(
        Date.UTC(
          Number(adParts[0]),
          Number(adParts[1]) - 1, // JS months are 0-indexed
          Number(adParts[2]),
          0,
          0,
          0,
          0,
        ),
      );

      if (isNaN(adDate.getTime())) {
        throw new BadRequestException(
          `Invalid conversion result: ${adDateStr}`,
        );
      }

      return adDate;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      const message = err instanceof Error ? err.message : String(err);
      throw new BadRequestException(
        `Invalid BS date format: ${message || 'Unknown error'}`,
      );
    }
  }

  adToBs(adDate: Date | string | number): string {
    try {
      if (!adDate) return '';
      let targetDate: Date;
      if (!(adDate instanceof Date)) {
        const raw = String(adDate ?? '').trim();
        const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (m) {
          const y = Number(m[1]);
          const mo = Number(m[2]);
          const d = Number(m[3]);
          targetDate = new Date(Date.UTC(y, mo - 1, d, 0, 0, 0, 0));
        } else {
          targetDate = new Date(raw);
        }
      } else {
        targetDate = adDate;
      }

      if (isNaN(targetDate.getTime())) {
        throw new BadRequestException('Invalid AD date');
      }

      // Use UTC methods to avoid timezone issues
      const year = targetDate.getUTCFullYear();
      const month = String(targetDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getUTCDate()).padStart(2, '0');

      const adDateStr = `${year}-${month}-${day}`;
      const bsDateResult = adToBs(adDateStr);

      let bsDateStr: string;
      if (typeof bsDateResult === 'string') {
        bsDateStr = bsDateResult;
      } else if (
        bsDateResult &&
        typeof bsDateResult === 'object' &&
        'year' in bsDateResult
      ) {
        const obj = bsDateResult as any;
        bsDateStr = `${obj.year}-${String(obj.month).padStart(2, '0')}-${String(obj.day).padStart(2, '0')}`;
      } else {
        throw new BadRequestException('Could not convert AD to BS');
      }

      return bsDateStr;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      const message = err instanceof Error ? err.message : String(err);
      throw new BadRequestException(
        `Invalid AD date: ${message || 'Unknown error'}`,
      );
    }
  }
}
