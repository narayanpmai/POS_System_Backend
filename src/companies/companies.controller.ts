import { Controller, Get, Post, Body, Put, Param, UseGuards, UnauthorizedException, Req, Delete } from '@nestjs/common';
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

  @Delete(':id')
  @Roles('Super Admin')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.companiesService.remove(Number(id));
  }
}
