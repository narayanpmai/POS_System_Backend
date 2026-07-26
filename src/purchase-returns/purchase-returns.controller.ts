import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PurchaseReturnsService } from './purchase-returns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('purchase-returns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchaseReturnsController {
  constructor(private readonly purchaseReturnsService: PurchaseReturnsService) {}

  @Post()
  async create(@Req() req: any, @Body() data: any) {
    return this.purchaseReturnsService.create(req.user.companyId, req.user.id, data);
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.purchaseReturnsService.findAll(req.user.companyId);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.purchaseReturnsService.findOne(req.user.companyId, +id);
  }
}
