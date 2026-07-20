import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounting')
@UseGuards(JwtAuthGuard)
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('accounts')
  getAccounts() {
    return this.accountingService.getAccounts();
  }

  @Post('accounts')
  createAccount(@Body() data: any) {
    return this.accountingService.createAccount(data);
  }

  @Get('journal-entries')
  getJournalEntries() {
    return this.accountingService.getJournalEntries();
  }

  @Post('journal-entries')
  createJournalEntry(@Body() data: any) {
    return this.accountingService.createJournalEntry(data);
  }

  @Get('trial-balance')
  getTrialBalance() {
    return this.accountingService.getTrialBalance();
  }
}
