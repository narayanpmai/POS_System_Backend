import { Module } from '@nestjs/common';
import { UnitConversionsService } from './unit-conversions.service';
import { UnitConversionsController } from './unit-conversions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UnitConversionsController],
  providers: [UnitConversionsService],
})
export class UnitConversionsModule {}
