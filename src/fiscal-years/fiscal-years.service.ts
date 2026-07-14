import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFiscalYearDto, UpdateFiscalYearDto } from './dto/fiscal-year.dto';

@Injectable()
export class FiscalYearsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.fiscalYear.findMany({
      orderBy: { startDate: 'desc' }
    });
  }

  async findActive() {
    return this.prisma.fiscalYear.findFirst({
      where: { isActive: true }
    });
  }

  async create(createDto: CreateFiscalYearDto) {
    const existing = await this.prisma.fiscalYear.findFirst({ where: { name: createDto.name } });
    if (existing) throw new BadRequestException('Fiscal Year name already exists');

    if (createDto.isActive) {
      await this.prisma.fiscalYear.updateMany({ data: { isActive: false } });
    }

    return this.prisma.fiscalYear.create({
      data: {
        name: createDto.name,
        startDate: new Date(createDto.startDate),
        endDate: new Date(createDto.endDate),
        isActive: createDto.isActive || false
      }
    });
  }

  async update(id: number, updateDto: UpdateFiscalYearDto) {
    const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy) throw new NotFoundException('Fiscal Year not found');

    if (updateDto.isActive) {
      await this.prisma.fiscalYear.updateMany({ data: { isActive: false } });
    }

    const data: any = { ...updateDto };
    if (updateDto.startDate) data.startDate = new Date(updateDto.startDate);
    if (updateDto.endDate) data.endDate = new Date(updateDto.endDate);

    return this.prisma.fiscalYear.update({
      where: { id },
      data
    });
  }

  async setActive(id: number) {
    const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy) throw new NotFoundException('Fiscal Year not found');

    // Deactivate all others
    await this.prisma.fiscalYear.updateMany({
      data: { isActive: false }
    });

    // Activate selected
    return this.prisma.fiscalYear.update({
      where: { id },
      data: { isActive: true }
    });
  }

  async delete(id: number) {
    const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy) throw new NotFoundException('Fiscal Year not found');
    if (fy.isActive) throw new BadRequestException('Cannot delete an active Fiscal Year');

    return this.prisma.fiscalYear.delete({ where: { id } });
  }
}
