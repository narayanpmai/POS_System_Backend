import { Global, Module } from '@nestjs/common';
import { DateConverterService } from './utils/date-converter.service';
import { BsToAdPipe } from './pipes/bs-to-ad.pipe';

@Global()
@Module({
  providers: [DateConverterService, BsToAdPipe],
  exports: [DateConverterService, BsToAdPipe],
})
export class CommonDateModule {}
