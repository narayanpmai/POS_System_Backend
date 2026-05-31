import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FiscalYearsService } from './fiscal-years.service';
import { CreateFiscalYearDto, UpdateFiscalYearDto } from './dto/fiscal-year.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Fiscal Years')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fiscal-years')
export class FiscalYearsController {
  constructor(private readonly fiscalYearsService: FiscalYearsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all fiscal years' })
  findAll() {
    return this.fiscalYearsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get currently active fiscal year' })
  findActive() {
    return this.fiscalYearsService.findActive();
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create a new fiscal year (Admin only)' })
  create(@Body() createDto: CreateFiscalYearDto) {
    return this.fiscalYearsService.create(createDto);
  }

  @Put(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update a fiscal year (Admin only)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateFiscalYearDto) {
    return this.fiscalYearsService.update(id, updateDto);
  }

  @Put(':id/set-active')
  @Roles('Admin')
  @ApiOperation({ summary: 'Set a fiscal year as active (Admin only)' })
  setActive(@Param('id', ParseIntPipe) id: number) {
    return this.fiscalYearsService.setActive(id);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete a fiscal year (Admin only)' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.fiscalYearsService.delete(id);
  }
}
