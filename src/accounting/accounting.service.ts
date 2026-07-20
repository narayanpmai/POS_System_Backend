import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountingService {
  constructor(private prisma: PrismaService) {}

  async getAccounts() {
    return this.prisma.account.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async createAccount(data: any) {
    return this.prisma.account.create({ data });
  }

  async getJournalEntries() {
    return this.prisma.journalEntry.findMany({
      include: {
        lines: {
          include: { account: true }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  async createJournalEntry(data: { description: string, referenceNo?: string, lines: { accountId: number, debit: number, credit: number, description?: string }[] }) {
    // Validate balanced entry
    const totalDebit = data.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = data.lines.reduce((sum, line) => sum + line.credit, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new Error('Journal Entry must balance (Debits = Credits)');
    }

    return this.prisma.journalEntry.create({
      data: {
        description: data.description,
        referenceNo: data.referenceNo,
        lines: {
          create: data.lines.map(line => ({
            accountId: line.accountId,
            debit: line.debit,
            credit: line.credit,
            description: line.description
          }))
        }
      }
    });
  }

  async getTrialBalance() {
    const accounts = await this.getAccounts();
    const balances = await Promise.all(accounts.map(async (acc) => {
      const lines = await this.prisma.journalEntryLine.findMany({
        where: { accountId: acc.id }
      });
      const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
      const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);
      
      let balance = 0;
      if (acc.type === 'ASSET' || acc.type === 'EXPENSE') {
        balance = totalDebit - totalCredit;
      } else {
        balance = totalCredit - totalDebit;
      }
      return {
        ...acc,
        totalDebit,
        totalCredit,
        balance
      };
    }));
    return balances;
  }
}
