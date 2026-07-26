import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFiscalYearDto, UpdateFiscalYearDto } from './dto/fiscal-year.dto';

@Injectable()
export class FiscalYearsService {
  constructor(private readonly prisma: PrismaService) {}

  private async enforceSingleActive(companyId: number) {
    const activeFys = await this.prisma.fiscalYear.findMany({
      where: { companyId, isActive: true },
      orderBy: { updatedAt: 'desc' }
    });

    if (activeFys.length > 1) {
      const [keepActive, ...othersToDeactivate] = activeFys;
      const idsToDeactivate = othersToDeactivate.map(f => f.id);
      await this.prisma.fiscalYear.updateMany({
        where: { id: { in: idsToDeactivate } },
        data: { isActive: false }
      });
    }
  }

  async findAll(companyId: number) {
    await this.enforceSingleActive(companyId);
    return this.prisma.fiscalYear.findMany({
      where: { companyId },
      orderBy: { startDate: 'desc' }
    });
  }

  async findActive(companyId: number) {
    await this.enforceSingleActive(companyId);
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

    const created = await this.prisma.fiscalYear.create({
      data: {
        name: createDto.name,
        startDate: new Date(createDto.startDate),
        endDate: new Date(createDto.endDate),
        isActive: createDto.isActive || false,
        companyId
      }
    });

    await this.enforceSingleActive(companyId);
    return created;
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

    const updated = await this.prisma.fiscalYear.update({
      where: { id },
      data
    });

    await this.enforceSingleActive(companyId);
    return updated;
  }

  async setActive(companyId: number, id: number) {
    const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy || fy.companyId !== companyId) throw new NotFoundException('Fiscal Year not found');

    // Deactivate all others for this company
    await this.prisma.fiscalYear.updateMany({
      where: { companyId },
      data: { isActive: false }
    });

    // Activate selected
    const updated = await this.prisma.fiscalYear.update({
      where: { id },
      data: { isActive: true }
    });

    await this.enforceSingleActive(companyId);
    return updated;
  }

  async delete(companyId: number, id: number) {
    const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy || fy.companyId !== companyId) throw new NotFoundException('Fiscal Year not found');
    if (fy.isActive) throw new BadRequestException('Cannot delete an active Fiscal Year');

    return this.prisma.fiscalYear.delete({ where: { id } });
  }
}

