import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UnitConversionsService } from './unit-conversions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUnitConversionDto } from './dto/unit-conversions.dto';

@UseGuards(JwtAuthGuard)
@Controller('unit-conversions')
export class UnitConversionsController {
  constructor(private readonly unitConversionsService: UnitConversionsService) {}

  @Post()
  create(@Body() createUnitConversionDto: CreateUnitConversionDto, @Req() req: any) {
    return this.unitConversionsService.create(req.user.companyId, createUnitConversionDto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.unitConversionsService.findAll(req.user.companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.unitConversionsService.remove(req.user.companyId, +id);
  }
}
