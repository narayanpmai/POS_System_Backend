import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateFiscalYearDto, UpdateFiscalYearDto } from './dto/fiscal-year.dto';

const prisma = new PrismaClient();

@Injectable()
export class FiscalYearsService {
  
  async findAll() {
    return prisma.fiscalYear.findMany({
      orderBy: { startDate: 'desc' }
    });
  }

  async findActive() {
    return prisma.fiscalYear.findFirst({
      where: { isActive: true }
    });
  }

  async create(createDto: CreateFiscalYearDto) {
    const existing = await prisma.fiscalYear.findUnique({ where: { name: createDto.name } });
    if (existing) throw new BadRequestException('Fiscal Year name already exists');

    if (createDto.isActive) {
      await prisma.fiscalYear.updateMany({ data: { isActive: false } });
    }

    return prisma.fiscalYear.create({
      data: {
        name: createDto.name,
        startDate: new Date(createDto.startDate),
        endDate: new Date(createDto.endDate),
        isActive: createDto.isActive || false
      }
    });
  }

  async update(id: number, updateDto: UpdateFiscalYearDto) {
    if (updateDto.isActive) {
      await prisma.fiscalYear.updateMany({ data: { isActive: false } });
    }
    
    const data: any = { ...updateDto };
    if (updateDto.startDate) data.startDate = new Date(updateDto.startDate);
    if (updateDto.endDate) data.endDate = new Date(updateDto.endDate);

    return prisma.fiscalYear.update({
      where: { id },
      data
    });
  }

  async setActive(id: number) {
    const fy = await prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy) throw new NotFoundException('Fiscal Year not found');

    // Deactivate all others
    await prisma.fiscalYear.updateMany({
      data: { isActive: false }
    });

    // Activate selected
    return prisma.fiscalYear.update({
      where: { id },
      data: { isActive: true }
    });
  }

  async delete(id: number) {
    const fy = await prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy) throw new NotFoundException('Fiscal Year not found');
    if (fy.isActive) throw new BadRequestException('Cannot delete an active Fiscal Year');

    return prisma.fiscalYear.delete({ where: { id } });
  }
}
