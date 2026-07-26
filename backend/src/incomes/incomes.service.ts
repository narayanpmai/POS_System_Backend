import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto, UpdateIncomeDto } from './dto/incomes.dto';

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

    return this.prisma.income.create({
      data: {
        referenceNo: dto.referenceNo,
        category: dto.category,
        amount: dto.amount,
        description: dto.description,
        date: txDate,
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

    return this.prisma.income.findMany({
      where,
      orderBy: { date: 'desc' },
    });
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
