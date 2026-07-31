import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PurchaseReturnsService } from './purchase-returns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Purchase Returns')
@ApiBearerAuth()
@Controller('purchase-returns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchaseReturnsController {
  constructor(private readonly purchaseReturnsService: PurchaseReturnsService) {}

  @Post()
  @ApiOperation({ summary: 'Process a purchase return debit memo' })
  async create(@Req() req: any, @Body() data: any) {
    return this.purchaseReturnsService.create(req.user.companyId, req.user.id, data);
  }

  @Get()
  @ApiOperation({ summary: 'List all purchase return transactions' })
  async findAll(@Req() req: any) {
    return this.purchaseReturnsService.findAll(req.user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific purchase return' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.purchaseReturnsService.findOne(req.user.companyId, +id);
  }
}
