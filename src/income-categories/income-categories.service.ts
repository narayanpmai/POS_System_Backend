import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeCategoryDto, UpdateIncomeCategoryDto } from './dto/income-categories.dto';

@Injectable()
export class IncomeCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(user: any, dto: CreateIncomeCategoryDto) {
    const existing = await this.prisma.incomeCategory.findFirst({
      where: { name: dto.name, companyId: user.companyId }
    });
    if (existing) {
      throw new BadRequestException('An income category with this name already exists');
    }

    return this.prisma.incomeCategory.create({
      data: {
        name: dto.name,
        description: dto.description,
        companyId: user.companyId,
      }
    });
  }

  async findAll(user: any, search?: string) {
    const where: any = { companyId: user.companyId };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }
    return this.prisma.incomeCategory.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(user: any, id: number) {
    const category = await this.prisma.incomeCategory.findUnique({ where: { id } });
    if (!category || category.companyId !== user.companyId) throw new NotFoundException('Income category not found');
    return category;
  }

  async update(user: any, id: number, dto: UpdateIncomeCategoryDto) {
    await this.findOne(user, id);

    if (dto.name) {
      const existing = await this.prisma.incomeCategory.findFirst({
        where: {
          name: dto.name,
          companyId: user.companyId,
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

  async remove(user: any, id: number) {
    const cat = await this.findOne(user, id);
    
    // Check if category is linked to any incomes (since they are stored as string)
    const linkedIncomes = await this.prisma.income.count({
      where: { category: cat.name, companyId: user.companyId }
    });
    if (linkedIncomes > 0) {
      throw new BadRequestException('Cannot delete an income category that has associated incomes logged');
    }

    return this.prisma.incomeCategory.delete({ where: { id } });
  }
}
