import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Cashier Shift Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current active open shift for cashier' })
  getCurrentShift(@Req() req: any) {
    return this.shiftsService.getCurrentShift(req.user.companyId, req.user.id);
  }

  @Post('start')
  @ApiOperation({ summary: 'Start cashier shift with opening cash float' })
  startShift(@Req() req: any, @Body('cashStart') cashStart: number) {
    return this.shiftsService.startShift(req.user.companyId, req.user.id, cashStart);
  }

  @Post('close')
  @ApiOperation({ summary: 'Close cashier shift with drawer cash count' })
  closeShift(@Req() req: any, @Body('cashEnd') cashEnd: number) {
    return this.shiftsService.closeShift(req.user.companyId, req.user.id, cashEnd);
  }
}
