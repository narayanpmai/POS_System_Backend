import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounting')
@UseGuards(JwtAuthGuard)
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('accounts')
  getAccounts(@Req() req: any) {
    return this.accountingService.getAccounts(req.user.companyId);
  }

  @Post('accounts')
  createAccount(@Req() req: any, @Body() data: any) {
    return this.accountingService.createAccount(req.user.companyId, data);
  }

  @Get('journal-entries')
  getJournalEntries(@Req() req: any) {
    return this.accountingService.getJournalEntries(req.user.companyId);
  }

  @Post('journal-entries')
  createJournalEntry(@Req() req: any, @Body() data: any) {
    return this.accountingService.createJournalEntry(req.user.companyId, data);
  }

  @Get('trial-balance')
  getTrialBalance(@Req() req: any) {
    return this.accountingService.getTrialBalance(req.user.companyId);
  }
}
