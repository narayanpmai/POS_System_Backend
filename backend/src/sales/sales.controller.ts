import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/sales.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('POS Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Process a new POS transaction checkout' })
  @ApiResponse({ status: 201, description: 'Sale processed successfully, returns transaction details' })
  checkout(@Body() dto: CreateSaleDto, @Req() req: any) {
    const cashierId = req.user.id;
    return this.salesService.checkout(req.user.companyId, dto, cashierId);
  }

  @Get()
  @ApiOperation({ summary: 'List sales transactions with date and keyword filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Format YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Format YYYY-MM-DD' })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  findAllSales(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.salesService.findAllSales(req.user.companyId, { page, limit, search, startDate, endDate, categoryId });
  }

  @Get('deleted')
  @ApiOperation({ summary: 'Get all deleted sales log (Admin only)' })
  getDeletedSales(@Req() req: any) {
    if (req.user.role.name !== 'Admin') {
      throw new Error('Unauthorized');
    }
    return this.salesService.getDeletedSales(req.user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific sale transaction for invoice/receipt' })
  findSaleById(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.salesService.findSaleById(req.user.companyId, id);
  }

  @Delete('clear-all')
  @ApiOperation({ summary: 'Clear all sales data (Admin only)' })
  clearAllSales(@Req() req: any) {
    if (req.user.role.name !== 'Admin') {
      throw new Error('Unauthorized');
    }
    return this.salesService.clearAllSales(req.user.companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sale transaction and revert stock (Admin only)' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    if (req.user.role.name !== 'Admin') {
      throw new Error('Unauthorized');
    }
    return this.salesService.remove(req.user.companyId, id, req.user.id);
  }
}
