import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountingService {
  constructor(private prisma: PrismaService) {}

  async ensureDefaultAccounts(companyId: number, txPrisma?: any) {
    const prismaClient = txPrisma || this.prisma;
    const defaultAccounts = [
      { code: '1000', name: 'Cash on Hand', type: 'ASSET', description: 'Main Cash Account' },
      { code: '1020', name: 'Bank Account', type: 'ASSET', description: 'Store Bank Account' },
      { code: '1300', name: 'Inventory Asset', type: 'ASSET', description: 'Store Inventory Asset' },
      { code: '2000', name: 'Accounts Payable', type: 'LIABILITY', description: 'Supplier Payables' },
      { code: '2100', name: 'Sales Tax Payable', type: 'LIABILITY', description: 'VAT / Tax Obligations' },
      { code: '3000', name: "Owner's Capital", type: 'EQUITY', description: 'Owner Initial Investment' },
      { code: '4000', name: 'Sales Revenue', type: 'REVENUE', description: 'Revenue from POS Sales' },
      { code: '4100', name: 'Other Income', type: 'REVENUE', description: 'Miscellaneous Income' },
      { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'EXPENSE', description: 'Direct Product Cost' },
      { code: '5100', name: 'Inventory Purchases', type: 'EXPENSE', description: 'Supplier Purchase Expenses' },
      { code: '5200', name: 'Operating Expenses', type: 'EXPENSE', description: 'General Store Expenses' },
    ];

    const accountMap: Record<string, number> = {};

    for (const acc of defaultAccounts) {
      let existing = await prismaClient.account.findFirst({
        where: { code: acc.code, companyId },
      });

      if (!existing) {
        existing = await prismaClient.account.create({
          data: {
            code: acc.code,
            name: acc.name,
            type: acc.type,
            description: acc.description,
            companyId,
          },
        });
      }
      accountMap[acc.code] = existing.id;
    }

    return accountMap;
  }

  async getAccounts(companyId: number) {
    await this.ensureDefaultAccounts(companyId);
    return this.prisma.account.findMany({
      where: { companyId },
      orderBy: { code: 'asc' },
    });
  }

  async createAccount(companyId: number, data: any) {
    return this.prisma.account.create({ data: { ...data, companyId } });
  }

  async getJournalEntries(companyId: number) {
    return this.prisma.journalEntry.findMany({
      where: { companyId },
      include: {
        lines: {
          include: { account: true }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  async createJournalEntry(companyId: number, data: { description: string, referenceNo?: string, lines: { accountId: number, debit: number, credit: number, description?: string }[] }) {
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
        companyId,
        lines: {
          create: data.lines.map(line => ({
            accountId: line.accountId,
            debit: line.debit,
            credit: line.credit,
            description: line.description,
          }))
        }
      }
    });
  }

  async getTrialBalance(companyId: number) {
    const accounts = await this.getAccounts(companyId);
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
