import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitConversionDto } from './dto/unit-conversions.dto';

@Injectable()
export class UnitConversionsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, dto: CreateUnitConversionDto) {
    return this.prisma.unitConversion.create({
      data: {
        ...dto,
        companyId,
      },
    });
  }

  async findAll(companyId: number) {
    return this.prisma.unitConversion.findMany({
      where: { companyId },
      include: { product: { select: { name: true, SKU: true } } },
    });
  }

  async remove(companyId: number, id: number) {
    const record = await this.prisma.unitConversion.findUnique({
      where: { id },
    });
    if (!record || record.companyId !== companyId) {
      throw new NotFoundException('Unit conversion not found');
    }
    return this.prisma.unitConversion.delete({
      where: { id },
    });
  }
}
