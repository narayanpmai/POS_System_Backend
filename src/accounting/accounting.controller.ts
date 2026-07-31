import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Accounting & Ledger')
@ApiBearerAuth()
@Controller('accounting')
@UseGuards(JwtAuthGuard)
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('accounts')
  @ApiOperation({ summary: 'List Chart of Accounts' })
  getAccounts(@Req() req: any) {
    return this.accountingService.getAccounts(req.user.companyId);
  }

  @Post('accounts')
  @ApiOperation({ summary: 'Create new ledger account' })
  createAccount(@Req() req: any, @Body() data: any) {
    return this.accountingService.createAccount(req.user.companyId, data);
  }

  @Get('journal-entries')
  @ApiOperation({ summary: 'List all double-entry journal logs' })
  getJournalEntries(@Req() req: any) {
    return this.accountingService.getJournalEntries(req.user.companyId);
  }

  @Post('journal-entries')
  @ApiOperation({ summary: 'Create manual journal entry' })
  createJournalEntry(@Req() req: any, @Body() data: any) {
    return this.accountingService.createJournalEntry(req.user.companyId, data);
  }

  @Get('trial-balance')
  @ApiOperation({ summary: 'Generate trial balance summary' })
  getTrialBalance(@Req() req: any) {
    return this.accountingService.getTrialBalance(req.user.companyId);
  }
}
