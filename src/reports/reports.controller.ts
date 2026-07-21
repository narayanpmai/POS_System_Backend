import { Controller, Get, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
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
  getDashboardSummary(
    @Req() req: any,
    @Query('companyId', new ParseIntPipe({ optional: true })) companyId?: number
  ) {
    return this.reportsService.getDashboardSummary(req.user, companyId);
  }

  @Get('sales')
  @Roles('Admin')
  @ApiOperation({ summary: 'Fetch date-ranged historical sales graphs and timelines (Admin Only)' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Format: YYYY-MM-DD' })
  getSalesAnalytics(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('companyId', new ParseIntPipe({ optional: true })) companyId?: number
  ) {
    return this.reportsService.getSalesAnalytics(req.user, startDate, endDate, companyId);
  }

  @Get('inventory-valuation')
  @Roles('Admin')
  @ApiOperation({ summary: 'Calculate total asset cost valuation and stock thresholds (Admin Only)' })
  getInventoryReport(
    @Req() req: any,
    @Query('companyId', new ParseIntPipe({ optional: true })) companyId?: number
  ) {
    return this.reportsService.getInventoryReport(req.user, companyId);
  }

  @Get('financial')
  @Roles('Admin')
  @ApiOperation({ summary: 'Comprehensive financial breakdown by Nepali Fiscal Year (Admin Only)' })
  getFinancialReport(
    @Req() req: any,
    @Query('companyId', new ParseIntPipe({ optional: true })) companyId?: number
  ) {
    return this.reportsService.getFinancialReport(req.user, companyId);
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
    @Query('companyId', new ParseIntPipe({ optional: true })) companyId?: number
  ) {
    return this.reportsService.getDailySummary(req.user, startDate, endDate, companyId);
  }

  @Get('closing-stock')
  @Roles('Admin')
  @ApiOperation({ summary: 'Calculate Closing Stock for Active Fiscal Year' })
  getClosingStock(
    @Req() req: any,
    @Query('companyId', new ParseIntPipe({ optional: true })) companyId?: number
  ) {
    return this.reportsService.getClosingStock(req.user, companyId);
  }

  @Get('closing-balance')
  @Roles('Admin')
  @ApiOperation({ summary: 'Calculate Closing Balance for Active Fiscal Year' })
  getClosingBalance(
    @Req() req: any,
    @Query('companyId', new ParseIntPipe({ optional: true })) companyId?: number
  ) {
    return this.reportsService.getClosingBalance(req.user, companyId);
  }
}
