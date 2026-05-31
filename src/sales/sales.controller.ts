import { Controller, Post, Get, Body, Param, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
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
    return this.salesService.checkout(dto, cashierId);
  }

  @Get()
  @ApiOperation({ summary: 'List sales transactions with date and keyword filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Format YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Format YYYY-MM-DD' })
  findAllSales(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.salesService.findAllSales({ page, limit, search, startDate, endDate });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific sale transaction for invoice/receipt' })
  findSaleById(@Param('id', ParseIntPipe) id: number) {
    return this.salesService.findSaleById(id);
  }
}
