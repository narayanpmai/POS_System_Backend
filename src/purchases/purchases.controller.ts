import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Purchases & Procurement')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin', 'Super Admin')
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create a new purchase order' })
  createPurchase(@Body() body: any, @Req() req: any) {
    return this.purchasesService.createPurchase(req.user.companyId, body, req.user.id);
  }

  @Put(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update an existing purchase order' })
  updatePurchase(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.purchasesService.updatePurchase(req.user.companyId, +id, body, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all purchase orders with pagination, search, and date filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Format: YYYY-MM-DD' })
  findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.purchasesService.findAll(req.user.companyId, { page, limit, search, startDate, endDate });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get purchase order details by ID' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.purchasesService.findOne(req.user.companyId, +id);
  }
}
