import { Module } from '@nestjs/common';
import { FiscalYearsController } from './fiscal-years.controller';
import { FiscalYearsService } from './fiscal-years.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FiscalYearsController],
  providers: [FiscalYearsService]
})
export class FiscalYearsModule {}
