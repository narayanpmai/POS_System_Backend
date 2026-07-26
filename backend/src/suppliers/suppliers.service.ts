import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/suppliers.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, dto: CreateSupplierDto) {
    // Check phone uniqueness if provided
    if (dto.phone) {
      const existing = await this.prisma.supplier.findFirst({
        where: { phone: dto.phone, companyId }
      });
      if (existing) {
        throw new BadRequestException('A supplier with this phone number already exists');
      }
    }

    return this.prisma.supplier.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        companyId,
      }
    });
  }

  async findAll(companyId: number, search?: string, page = 1, limit = 100) {
    const where: any = { companyId };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.supplier.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(companyId: number, id: number) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier || supplier.companyId !== companyId) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async update(companyId: number, id: number, dto: UpdateSupplierDto) {
    await this.findOne(companyId, id);

    if (dto.phone) {
      const existing = await this.prisma.supplier.findFirst({
        where: {
          phone: dto.phone,
          companyId,
          id: { not: id }
        }
      });
      if (existing) {
        throw new BadRequestException('Another supplier with this phone number already exists');
      }
    }

    return this.prisma.supplier.update({
      where: { id },
      data: dto,
    });
  }

  async remove(companyId: number, id: number) {
    await this.findOne(companyId, id);
    
    // Check if supplier is linked to any purchases or inventory transactions
    const linkedPurchases = await this.prisma.purchase.count({ where: { supplierId: id } });
    const linkedTransactions = await this.prisma.inventoryTransaction.count({ where: { supplierId: id } });
    
    if (linkedPurchases > 0 || linkedTransactions > 0) {
      throw new BadRequestException('Cannot delete supplier with associated purchase history or inventory ledgers');
    }

    return this.prisma.supplier.delete({ where: { id } });
  }
}
