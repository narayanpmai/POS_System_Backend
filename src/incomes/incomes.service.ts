import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto, UpdateIncomeDto } from './dto/incomes.dto';

@Injectable()
export class IncomesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateIncomeDto) {
    return this.prisma.income.create({
      data: {
        referenceNo: dto.referenceNo,
        category: dto.category,
        amount: dto.amount,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : new Date(),
      }
    });
  }

  async findAll(search?: string, category?: string) {
    const where: any = {};
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

    return this.prisma.income.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number) {
    const income = await this.prisma.income.findUnique({ where: { id } });
    if (!income) throw new NotFoundException('Income not found');
    return income;
  }

  async update(id: number, dto: UpdateIncomeDto) {
    await this.findOne(id);
    
    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }

    return this.prisma.income.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.income.delete({ where: { id } });
  }
}
