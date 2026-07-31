import { Controller, Get, Post, Body, Put, Delete, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Companies & Multi-Tenancy')
@ApiBearerAuth()
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @Roles('Super Admin')
  @ApiOperation({ summary: 'List all companies (Super Admin Only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.companiesService.findAll({ search, page, limit });
  }

  @Post()
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Register a new tenant company with default admin' })
  async create(@Req() req: any, @Body() data: any) {
    return this.companiesService.create(data);
  }

  @Put(':id')
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Update company details' })
  async update(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.companiesService.update(Number(id), data);
  }

  @Post(':id/flush-data')
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Flush all operational data for a company' })
  async flushData(@Req() req: any, @Param('id') id: string) {
    return this.companiesService.flushCompanyData(Number(id));
  }

  @Post(':id/assign-admin')
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Assign or create an admin user for a company' })
  async assignAdmin(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.companiesService.assignAdmin(Number(id), data);
  }

  @Delete(':id')
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Deactivate or permanently delete a company' })
  async remove(@Req() req: any, @Param('id') id: string, @Query('permanent') permanent?: string) {
    if (permanent === 'true') {
      return this.companiesService.deleteCompanyPermanently(Number(id));
    }
    return this.companiesService.deleteCompany(Number(id));
  }
}
