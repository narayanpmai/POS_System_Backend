import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeCategoryDto, UpdateIncomeCategoryDto } from './dto/income-categories.dto';
import { buildPaginatedResponse } from '../common/interfaces/api-response.interface';

@Injectable()
export class IncomeCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, dto: CreateIncomeCategoryDto) {
    const existing = await this.prisma.incomeCategory.findFirst({
      where: { name: dto.name, companyId }
    });
    if (existing) {
      throw new BadRequestException('An income category with this name already exists');
    }

    return this.prisma.incomeCategory.create({
      data: {
        name: dto.name,
        description: dto.description,
        companyId,
      }
    });
  }

  private async ensureDefaultCategories(companyId: number) {
    const count = await this.prisma.incomeCategory.count({ where: { companyId } });
    if (count === 0) {
      const defaults = [
        { name: 'POS Sales Revenue', description: 'Revenue generated from POS counter customer sales' },
        { name: 'Export Fee & Services', description: 'Fees and service charges collected for export or delivery' },
        { name: 'Investments & Capital', description: 'Owner capital infusions and business investments' },
        { name: 'Rental & Lease Income', description: 'Income from renting out store equipment or space' },
        { name: 'Other Miscellaneous Income', description: 'Other general store incomes' },
      ];

      for (const def of defaults) {
        await this.prisma.incomeCategory.create({
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
      this.prisma.incomeCategory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.incomeCategory.count({ where }),
    ]);

    return buildPaginatedResponse(items, total, page, limit);
  }

  async findOne(companyId: number, id: number) {
    const category = await this.prisma.incomeCategory.findUnique({ where: { id, companyId } });
    if (!category) throw new NotFoundException('Income category not found');
    return category;
  }

  async update(companyId: number, id: number, dto: UpdateIncomeCategoryDto) {
    await this.findOne(companyId, id);

    if (dto.name) {
      const existing = await this.prisma.incomeCategory.findFirst({
        where: {
          name: dto.name,
          companyId,
          id: { not: id }
        }
      });
      if (existing) {
        throw new BadRequestException('Another income category with this name already exists');
      }
    }

    return this.prisma.incomeCategory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(companyId: number, id: number) {
    const cat = await this.findOne(companyId, id);
    
    // Check if category is linked to any incomes (since they are stored as string)
    const linkedIncomes = await this.prisma.income.count({
      where: { category: cat.name, companyId }
    });
    if (linkedIncomes > 0) {
      throw new BadRequestException('Cannot delete an income category that has associated incomes logged');
    }

    return this.prisma.incomeCategory.delete({ where: { id } });
  }
}
