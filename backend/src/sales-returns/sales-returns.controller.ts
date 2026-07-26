import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SalesReturnsService } from './sales-returns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('sales-returns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesReturnsController {
  constructor(private readonly salesReturnsService: SalesReturnsService) {}

  @Post()
  async create(@Req() req: any, @Body() data: any) {
    return this.salesReturnsService.create(req.user.companyId, req.user.id, data);
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.salesReturnsService.findAll(req.user.companyId);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.salesReturnsService.findOne(req.user.companyId, +id);
  }
}
