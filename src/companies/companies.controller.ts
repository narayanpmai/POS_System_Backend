import { Controller, Get, Post, Body, Put, Delete, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @Roles('Super Admin')
  async findAll(@Req() req: any) {
    return this.companiesService.findAll();
  }

  @Post()
  @Roles('Super Admin')
  async create(@Req() req: any, @Body() data: any) {
    return this.companiesService.create(data);
  }

  @Put(':id')
  @Roles('Super Admin')
  async update(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.companiesService.update(Number(id), data);
  }

  @Post(':id/flush-data')
  @Roles('Super Admin')
  async flushData(@Req() req: any, @Param('id') id: string) {
    return this.companiesService.flushCompanyData(Number(id));
  }

  @Delete(':id')
  @Roles('Super Admin')
  async remove(@Req() req: any, @Param('id') id: string, @Query('permanent') permanent?: string) {
    if (permanent === 'true') {
      return this.companiesService.deleteCompanyPermanently(Number(id));
    }
    return this.companiesService.deleteCompany(Number(id));
  }
}
