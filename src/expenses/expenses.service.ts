import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expenses.dto';
import { buildPaginatedResponse } from '../common/interfaces/api-response.interface';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  private async ensureActiveFiscalYear(companyId: number, txPrisma?: any) {
    const client = txPrisma || this.prisma;
    let activeFy = await client.fiscalYear.findFirst({ where: { isActive: true, companyId } });
    if (!activeFy) {
      const year = new Date().getFullYear();
      activeFy = await client.fiscalYear.create({
        data: {
          name: `${year}/${(year + 1).toString().slice(-2)}`,
          startDate: new Date('2020-01-01T00:00:00.000Z'),
          endDate: new Date('2035-12-31T23:59:59.000Z'),
          isActive: true,
          companyId,
        },
      });
    }
    return activeFy;
  }

  async create(companyId: number, dto: CreateExpenseDto) {
    const activeFy = await this.ensureActiveFiscalYear(companyId);
    const txDate = dto.date ? new Date(dto.date) : new Date();

    return this.prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          referenceNo: dto.referenceNo,
          category: dto.category,
          amount: dto.amount,
          description: dto.description,
          date: txDate,
          companyId,
        }
      });

      // Accounting: Generate Double-Entry Journal Entry
      const defaultAccounts = [
        { code: '1000', name: 'Cash on Hand', type: 'ASSET', description: 'Main Cash Account' },
        { code: '5200', name: 'Operating Expenses', type: 'EXPENSE', description: 'General Store Expenses' },
      ];

      const accMap: Record<string, number> = {};
      for (const acc of defaultAccounts) {
        let existing = await tx.account.findFirst({ where: { code: acc.code, companyId } });
        if (!existing) {
          existing = await tx.account.create({
            data: { code: acc.code, name: acc.name, type: acc.type, description: acc.description, companyId },
          });
        }
        accMap[acc.code] = existing.id;
      }

      await tx.journalEntry.create({
        data: {
          companyId,
          referenceNo: dto.referenceNo || `EXP-${expense.id}`,
          description: `Expense (${dto.category}): ${dto.description || 'Operating Expense'}`,
          lines: {
            create: [
              { accountId: accMap['5200'], debit: Number(dto.amount), credit: 0, description: `Expense - ${dto.category}` },
              { accountId: accMap['1000'], debit: 0, credit: Number(dto.amount), description: 'Cash Paid for Expense' },
            ],
          },
        },
      });

      return expense;
    });
  }

  async findAll(companyId: number, search?: string, category?: string, pageQuery = 1, limitQuery = 10) {
    const page = Math.max(1, Number(pageQuery) || 1);
    const limit = Math.min(500, Math.max(1, Number(limitQuery) || 10));

    const where: any = { companyId };
    if (search) {
      where.OR = [
        { referenceNo: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (category && category !== 'Inventory Purchases') {
      where.category = category;
    }

    const [manualExpenses, purchases] = await Promise.all([
      category === 'Inventory Purchases' ? [] : this.prisma.expense.findMany({
        where,
        orderBy: { date: 'desc' },
      }),
      category && category !== 'Inventory Purchases' ? [] : this.prisma.purchase.findMany({
        where: search
          ? { companyId, poNumber: { contains: search, mode: 'insensitive' } }
          : { companyId },
        orderBy: { purchaseDate: 'desc' },
      }),
    ]);

    const mappedPurchases = purchases.map((pur) => ({
      id: `purchase-${pur.id}`,
      referenceNo: pur.poNumber,
      category: 'Inventory Purchases',
      amount: pur.totalAmount,
      description: `Supplier Stock Purchase (${pur.status || 'RECEIVED'})`,
      date: pur.purchaseDate || pur.createdAt,
      createdAt: pur.createdAt,
      companyId: pur.companyId,
      isPurchaseRecord: true,
    }));

    const combined = [...manualExpenses, ...mappedPurchases].sort(
      (a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
    );

    const total = combined.length;
    const paginatedItems = combined.slice((page - 1) * limit, page * limit);

    return buildPaginatedResponse(paginatedItems, total, page, limit);
  }

  async findOne(companyId: number, id: number) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense || expense.companyId !== companyId) throw new NotFoundException('Expense not found');
    return expense;
  }

  async update(companyId: number, id: number, dto: UpdateExpenseDto) {
    await this.findOne(companyId, id);
    
    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }

    return this.prisma.expense.update({
      where: { id },
      data,
    });
  }

  async remove(companyId: number, id: number) {
    await this.findOne(companyId, id);
    return this.prisma.expense.delete({ where: { id } });
  }
}
