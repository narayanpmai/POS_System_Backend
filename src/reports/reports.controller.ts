import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Reporting & Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard-summary')
  @ApiOperation({ summary: 'Retrieve full KPI dashboard widgets dataset' })
  @ApiQuery({ name: 'companyId', required: false, type: Number })
  getDashboardSummary(@Req() req: any, @Query('companyId') queryCompanyId?: string) {
    const cid = (req.user.role.name === 'Super Admin' && queryCompanyId) ? Number(queryCompanyId) : req.user.companyId;
    return this.reportsService.getDashboardSummary(cid);
  }

  @Get('sales')
  @Roles('Admin', 'Super Admin')
  @ApiOperation({ summary: 'Fetch date-ranged historical sales graphs and timelines' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'companyId', required: false, type: Number })
  getSalesAnalytics(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('companyId') queryCompanyId?: string,
  ) {
    const cid = (req.user.role.name === 'Super Admin' && queryCompanyId) ? Number(queryCompanyId) : req.user.companyId;
    return this.reportsService.getSalesAnalytics(cid, startDate, endDate);
  }

  @Get('inventory-valuation')
  @ApiQuery({ name: 'companyId', required: false, type: Number })
  @ApiOperation({ summary: 'Calculate total asset cost valuation and stock thresholds' })
  getInventoryReport(@Req() req: any, @Query('companyId') queryCompanyId?: string) {
    const cid = (req.user.role.name === 'Super Admin' && queryCompanyId) ? Number(queryCompanyId) : req.user.companyId;
    return this.reportsService.getInventoryReport(cid);
  }

  @Get('financial')
  @Roles('Admin')
  @ApiOperation({ summary: 'Comprehensive financial breakdown by Nepali Fiscal Year (Admin Only)' })
  getFinancialReport(@Req() req: any) {
    return this.reportsService.getFinancialReport(req.user.companyId);
  }

  @Get('daily-summary')
  @Roles('Admin')
  @ApiOperation({ summary: 'Daily report summary with telemetry widgets and daily timelines (Admin Only)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  getDailySummary(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getDailySummary(req.user.companyId, startDate, endDate);
  }

  @Get('closing-stock')
  @Roles('Admin')
  @ApiOperation({ summary: 'Calculate Closing Stock for Active Fiscal Year' })
  getClosingStock(@Req() req: any) {
    return this.reportsService.getClosingStock(req.user.companyId);
  }

  @Get('closing-balance')
  @Roles('Admin')
  @ApiOperation({ summary: 'Calculate Closing Balance for Active Fiscal Year' })
  getClosingBalance(@Req() req: any) {
    return this.reportsService.getClosingBalance(req.user.companyId);
  }

  @Get('stock-movements')
  @Roles('Admin', 'Super Admin')
  @ApiOperation({ summary: 'Retrieve full inventory stock movement audit trail ledger' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'type', required: false, enum: ['STOCK_IN', 'STOCK_OUT'] })
  @ApiQuery({ name: 'productId', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getStockMovements(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: string,
    @Query('productId') productId?: number,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reportsService.getStockMovements(req.user.companyId, {
      startDate,
      endDate,
      type,
      productId: productId ? Number(productId) : undefined,
      search,
      page,
      limit,
    });
  }
}

