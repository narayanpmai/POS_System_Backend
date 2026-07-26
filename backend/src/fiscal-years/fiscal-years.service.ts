import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFiscalYearDto, UpdateFiscalYearDto } from './dto/fiscal-year.dto';

@Injectable()
export class FiscalYearsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(companyId: number) {
    return this.prisma.fiscalYear.findMany({
      where: { companyId },
      orderBy: { startDate: 'desc' }
    });
  }

  async findActive(companyId: number) {
    return this.prisma.fiscalYear.findFirst({
      where: { isActive: true, companyId }
    });
  }

  async create(companyId: number, createDto: CreateFiscalYearDto) {
    const existing = await this.prisma.fiscalYear.findUnique({ where: { name_companyId: { name: createDto.name, companyId } } });
    if (existing) throw new BadRequestException('Fiscal Year name already exists');

    if (createDto.isActive) {
      await this.prisma.fiscalYear.updateMany({ where: { companyId }, data: { isActive: false } });
    }

    return this.prisma.fiscalYear.create({
      data: {
        name: createDto.name,
        startDate: new Date(createDto.startDate),
        endDate: new Date(createDto.endDate),
        isActive: createDto.isActive || false,
        companyId
      }
    });
  }

  async update(companyId: number, id: number, updateDto: UpdateFiscalYearDto) {
    const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy || fy.companyId !== companyId) throw new NotFoundException('Fiscal Year not found');

    if (updateDto.isActive) {
      await this.prisma.fiscalYear.updateMany({ where: { companyId }, data: { isActive: false } });
    }

    const data: any = { ...updateDto };
    if (updateDto.startDate) data.startDate = new Date(updateDto.startDate);
    if (updateDto.endDate) data.endDate = new Date(updateDto.endDate);

    return this.prisma.fiscalYear.update({
      where: { id },
      data
    });
  }

  async setActive(companyId: number, id: number) {
    const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy || fy.companyId !== companyId) throw new NotFoundException('Fiscal Year not found');

    // Deactivate all others
    await this.prisma.fiscalYear.updateMany({
      where: { companyId },
      data: { isActive: false }
    });

    // Activate selected
    return this.prisma.fiscalYear.update({
      where: { id },
      data: { isActive: true }
    });
  }

  async delete(companyId: number, id: number) {
    const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy || fy.companyId !== companyId) throw new NotFoundException('Fiscal Year not found');
    if (fy.isActive) throw new BadRequestException('Cannot delete an active Fiscal Year');

    return this.prisma.fiscalYear.delete({ where: { id } });
  }
}
