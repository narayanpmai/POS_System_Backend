import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto, UpdateIncomeDto } from './dto/incomes.dto';
import { buildPaginatedResponse } from '../common/interfaces/api-response.interface';

@Injectable()
export class IncomesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, dto: CreateIncomeDto) {
    const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true, companyId } });
    if (!activeFy) {
      throw new BadRequestException('No active fiscal year found. Please activate a fiscal year first.');
    }
    const txDate = dto.date ? new Date(dto.date) : new Date();
    if (txDate < activeFy.startDate || txDate > activeFy.endDate) {
      throw new BadRequestException(`Transaction date must fall within the active fiscal year (${activeFy.name})`);
    }

    return this.prisma.$transaction(async (tx) => {
      const income = await tx.income.create({
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
        { code: '4100', name: 'Other Income', type: 'REVENUE', description: 'Miscellaneous Income' },
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
          referenceNo: dto.referenceNo || `INC-${income.id}`,
          description: `Income (${dto.category}): ${dto.description || 'Other Income'}`,
          lines: {
            create: [
              { accountId: accMap['1000'], debit: Number(dto.amount), credit: 0, description: 'Cash Received for Income' },
              { accountId: accMap['4100'], debit: 0, credit: Number(dto.amount), description: `Revenue - ${dto.category}` },
            ],
          },
        },
      });

      return income;
    });
  }

  async findAll(companyId: number, search?: string, category?: string, pageQuery = 1, limitQuery = 10) {
    const page = Math.max(1, Number(pageQuery) || 1);
    const limit = Math.min(500, Math.max(1, Number(limitQuery) || 10));
    const skip = (page - 1) * limit;

    const where: any = { companyId };
    if (search) {
      where.OR = [
        { referenceNo: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (category) {
      where.category = category;
    }

    const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true, companyId } });
    if (activeFy) {
      where.date = {
        gte: activeFy.startDate,
        lte: activeFy.endDate
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.income.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.income.count({ where }),
    ]);

    return buildPaginatedResponse(items, total, page, limit);
  }

  async findOne(companyId: number, id: number) {
    const income = await this.prisma.income.findUnique({ where: { id } });
    if (!income || income.companyId !== companyId) throw new NotFoundException('Income not found');
    return income;
  }

  async update(companyId: number, id: number, dto: UpdateIncomeDto) {
    await this.findOne(companyId, id);
    
    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }

    return this.prisma.income.update({
      where: { id },
      data,
    });
  }

  async remove(companyId: number, id: number) {
    await this.findOne(companyId, id);
    return this.prisma.income.delete({ where: { id } });
  }
}
