import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseCategoryDto, UpdateExpenseCategoryDto } from './dto/expense-categories.dto';
import { buildPaginatedResponse } from '../common/interfaces/api-response.interface';

@Injectable()
export class ExpenseCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, dto: CreateExpenseCategoryDto) {
    const existing = await this.prisma.expenseCategory.findFirst({
      where: { name: dto.name, companyId }
    });
    if (existing) {
      throw new BadRequestException('An expense category with this name already exists');
    }

    return this.prisma.expenseCategory.create({
      data: {
        name: dto.name,
        description: dto.description,
        companyId,
      }
    });
  }

  private async ensureDefaultCategories(companyId: number) {
    const count = await this.prisma.expenseCategory.count({ where: { companyId } });
    if (count === 0) {
      const defaults = [
        { name: 'Inventory Purchases', description: 'Supplier stock purchases and inventory acquisitions' },
        { name: 'OPERATIONAL', description: 'General day-to-day store operations and utilities' },
        { name: 'RENT & UTILITIES', description: 'Store rent, electricity, water, and internet bills' },
        { name: 'STAFF & SALARY', description: 'Employee salaries, wages, and staff welfare' },
        { name: 'CAPITAL', description: 'Capital equipment, machinery, and store fixtures' },
        { name: 'UNEXPECTED', description: 'Emergency repairs, maintenance, and unforeseen expenses' },
      ];

      for (const def of defaults) {
        await this.prisma.expenseCategory.create({
          data: { ...def, companyId }
        });
      }
    }
  }

  async findAll(companyId: number, search?: string, pageQuery = 1, limitQuery = 10) {
    await this.ensureDefaultCategories(companyId);

    const page = Math.max(1, Number(pageQuery) || 1);
    const limit = Math.min(500, Math.max(1, Number(limitQuery) || 10));
    const skip = (page - 1) * limit;

    const where: any = { companyId };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.expenseCategory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.expenseCategory.count({ where }),
    ]);

    return buildPaginatedResponse(items, total, page, limit);
  }

  async findOne(companyId: number, id: number) {
    const category = await this.prisma.expenseCategory.findUnique({ where: { id, companyId } });
    if (!category) throw new NotFoundException('Expense category not found');
    return category;
  }

  async update(companyId: number, id: number, dto: UpdateExpenseCategoryDto) {
    await this.findOne(companyId, id);

    if (dto.name) {
      const existing = await this.prisma.expenseCategory.findFirst({
        where: {
          name: dto.name,
          companyId,
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

  async remove(companyId: number, id: number) {
    const cat = await this.findOne(companyId, id);
    
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
