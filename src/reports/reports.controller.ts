import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
  getDashboardSummary() {
    return this.reportsService.getDashboardSummary();
  }

  @Get('sales')
  @Roles('Admin')
  @ApiOperation({ summary: 'Fetch date-ranged historical sales graphs and timelines (Admin Only)' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Format: YYYY-MM-DD' })
  getSalesAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getSalesAnalytics(startDate, endDate);
  }

  @Get('inventory-valuation')
  @Roles('Admin')
  @ApiOperation({ summary: 'Calculate total asset cost valuation and stock thresholds (Admin Only)' })
  getInventoryReport() {
    return this.reportsService.getInventoryReport();
  }

  @Get('financial')
  @Roles('Admin')
  @ApiOperation({ summary: 'Comprehensive financial breakdown by Nepali Fiscal Year (Admin Only)' })
  getFinancialReport() {
    return this.reportsService.getFinancialReport();
  }

  @Get('daily-summary')
  @Roles('Admin')
  @ApiOperation({ summary: 'Daily report summary with telemetry widgets and daily timelines (Admin Only)' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  getDailySummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getDailySummary(startDate, endDate);
  }

  @Get('closing-stock')
  @Roles('Admin')
  @ApiOperation({ summary: 'Calculate Closing Stock for Active Fiscal Year' })
  getClosingStock() {
    return this.reportsService.getClosingStock();
  }

  @Get('closing-balance')
  @Roles('Admin')
  @ApiOperation({ summary: 'Calculate Closing Balance for Active Fiscal Year' })
  getClosingBalance() {
    return this.reportsService.getClosingBalance();
  }
}
