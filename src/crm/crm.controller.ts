import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CrmService } from './crm.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('crm')
@UseGuards(JwtAuthGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('tiers')
  getTiers() {
    return this.crmService.getTiers();
  }

  @Get('customers/:id')
  getCustomerCrmData(@Param('id') id: string) {
    return this.crmService.getCustomerCrmData(Number(id));
  }

  @Post('customers/:id/wallet')
  adjustWallet(@Param('id') id: string, @Body() body: { amount: number; reason: string }) {
    return this.crmService.adjustWallet(Number(id), body.amount, body.reason);
  }

  @Post('customers/:id/points')
  addRewardPoints(@Param('id') id: string, @Body() body: { points: number; reason: string }) {
    return this.crmService.addRewardPoints(Number(id), body.points, body.reason);
  }
}
