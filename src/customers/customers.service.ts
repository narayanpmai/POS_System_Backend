import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customers.dto';
import { buildPaginatedResponse } from '../common/interfaces/api-response.interface';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, dto: CreateCustomerDto) {
    if (dto.phone) {
      const exists = await this.prisma.customer.findUnique({
        where: { phone_companyId: { phone: dto.phone, companyId } },
      });
      if (exists) {
        throw new BadRequestException('A customer with this phone number is already registered');
      }
    }
    return this.prisma.customer.create({ data: { ...dto, companyId } });
  }

  async findAll(companyId: number, query: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(500, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = { companyId };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        include: { membershipTier: true },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.customer.count({ where }),
    ]);

    return buildPaginatedResponse(items, total, page, limit);
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        sales: {
          orderBy: { createdAt: 'desc' },
          take: 10, // return last 10 purchases
        },
      },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async findByPhone(companyId: number, phone: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { phone_companyId: { phone, companyId } },
    });
    if (!customer) throw new NotFoundException(`Customer with phone number ${phone} not found`);
    return customer;
  }

  async update(companyId: number, id: number, dto: UpdateCustomerDto) {
    const current = await this.findOne(id);

    if (dto.phone && dto.phone !== current.phone) {
      const exists = await this.prisma.customer.findUnique({
        where: { phone_companyId: { phone: dto.phone, companyId } },
      });
      if (exists) {
        throw new BadRequestException('A customer with this phone number is already registered');
      }
    }

    return this.prisma.customer.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    
    // Prevent delete if customer has sales records
    const salesCount = await this.prisma.sale.count({
      where: { customerId: id },
    });
    if (salesCount > 0) {
      throw new BadRequestException('Cannot delete customer with active transaction history. Consider cleaning or updating profile instead.');
    }

    return this.prisma.customer.delete({ where: { id } });
  }
}
