import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        referenceNo: dto.referenceNo,
        category: dto.category,
        amount: dto.amount,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : new Date(),
        companyId,
      }
    });
  }

  async findAll(companyId: number, search?: string, category?: string) {
    const where: any = { companyId };
    if (search) {
      where.OR = [
        { referenceNo: { contains: search } },
        { description: { contains: search } }
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

    return this.prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    });
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
