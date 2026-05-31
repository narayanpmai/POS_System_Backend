import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseCategoryDto, UpdateExpenseCategoryDto } from './dto/expense-categories.dto';

@Injectable()
export class ExpenseCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExpenseCategoryDto) {
    const existing = await this.prisma.expenseCategory.findFirst({
      where: { name: dto.name }
    });
    if (existing) {
      throw new BadRequestException('An expense category with this name already exists');
    }

    return this.prisma.expenseCategory.create({
      data: {
        name: dto.name,
        description: dto.description,
      }
    });
  }

  async findAll(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }
    return this.prisma.expenseCategory.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.expenseCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Expense category not found');
    return category;
  }

  async update(id: number, dto: UpdateExpenseCategoryDto) {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.prisma.expenseCategory.findFirst({
        where: {
          name: dto.name,
          id: { not: id }
        }
      });
      if (existing) {
        throw new BadRequestException('Another expense category with this name already exists');
      }
    }

    return this.prisma.expenseCategory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const cat = await this.findOne(id);
    
    // Check if category is linked to any expenses (since they are stored as string)
    const linkedExpenses = await this.prisma.expense.count({
      where: { category: cat.name }
    });
    if (linkedExpenses > 0) {
      throw new BadRequestException('Cannot delete an expense category that has associated expenses logged');
    }

    return this.prisma.expenseCategory.delete({ where: { id } });
  }
}
