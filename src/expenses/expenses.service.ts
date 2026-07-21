import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(user: any, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        referenceNo: dto.referenceNo,
        category: dto.category,
        amount: dto.amount,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : new Date(),
        companyId: user.companyId,
      }
    });
  }

  async findAll(user: any, search?: string, category?: string) {
    const where: any = { companyId: user.companyId };
    if (search) {
      where.OR = [
        { referenceNo: { contains: search } },
        { description: { contains: search } }
      ];
    }
    if (category) {
      where.category = category;
    }

    const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true } });
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

  async findOne(user: any, id: number) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense || expense.companyId !== user.companyId) throw new NotFoundException('Expense not found');
    return expense;
  }

  async update(user: any, id: number, dto: UpdateExpenseDto) {
    await this.findOne(user, id);
    
    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }

    return this.prisma.expense.update({
      where: { id },
      data,
    });
  }

  async remove(user: any, id: number) {
    await this.findOne(user, id);
    return this.prisma.expense.delete({ where: { id } });
  }
}
