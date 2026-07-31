import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
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
  findAll(@Req() req: any) {
    return this.fiscalYearsService.findAll(req.user.companyId);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get currently active fiscal year' })
  findActive(@Req() req: any) {
    return this.fiscalYearsService.findActive(req.user.companyId);
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create a new fiscal year (Admin only)' })
  create(@Req() req: any, @Body() createDto: CreateFiscalYearDto) {
    return this.fiscalYearsService.create(req.user.companyId, createDto);
  }

  @Put(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update a fiscal year (Admin only)' })
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateFiscalYearDto) {
    return this.fiscalYearsService.update(req.user.companyId, id, updateDto);
  }

  @Put(':id/set-active')
  @Roles('Admin')
  @ApiOperation({ summary: 'Set a fiscal year as active (Admin only)' })
  setActive(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.fiscalYearsService.setActive(req.user.companyId, id);
  }

  @Get(':id/rollover-summary')
  @Roles('Admin')
  @ApiOperation({ summary: 'Get financial summary for fiscal year rollover' })
  getRolloverSummary(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.fiscalYearsService.getRolloverSummary(req.user.companyId, id);
  }

  @Post(':id/close')
  @Roles('Admin')
  @ApiOperation({ summary: 'Close fiscal year and carry forward stock (Admin only)' })
  closeFiscalYear(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() nextFyDto?: any) {
    return this.fiscalYearsService.closeFiscalYear(req.user.companyId, id, nextFyDto);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete a fiscal year (Admin only)' })
  delete(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.fiscalYearsService.delete(req.user.companyId, id);
  }
}
