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

  async getRolloverSummary(companyId: number, id: number) {
    const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy || fy.companyId !== companyId) throw new NotFoundException('Fiscal Year not found');

    const dateFilter = { gte: fy.startDate, lte: fy.endDate };

    const [salesAggregate, purchasesAggregate, expensesAggregate, incomesAggregate, products] = await Promise.all([
      this.prisma.sale.aggregate({
        where: { companyId, createdAt: dateFilter },
        _sum: { totalAmount: true },
      }),
      this.prisma.purchase.aggregate({
        where: { companyId, purchaseDate: dateFilter },
        _sum: { totalAmount: true },
      }),
      this.prisma.expense.aggregate({
        where: { companyId, date: dateFilter },
        _sum: { amount: true },
      }),
      this.prisma.income.aggregate({
        where: { companyId, date: dateFilter },
        _sum: { amount: true },
      }),
      this.prisma.product.findMany({
        where: { companyId },
        select: { id: true, stock: true, cost: true },
      }),
    ]);

    const totalSales = salesAggregate._sum.totalAmount || 0;
    const totalPurchases = purchasesAggregate._sum.totalAmount || 0;
    const totalExpenses = expensesAggregate._sum.amount || 0;
    const totalIncomes = incomesAggregate._sum.amount || 0;
    const netProfit = (totalSales + totalIncomes) - (totalPurchases + totalExpenses);
    const totalProductsCount = products.length;
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.stock * p.cost), 0);

    return {
      fiscalYear: fy,
      totalSales,
      totalPurchases,
      totalExpenses,
      totalIncomes,
      netProfit,
      totalProductsCount,
      totalInventoryValue,
    };
  }

  async closeFiscalYear(companyId: number, id: number, nextFyDto?: { name: string, startDate: string, endDate: string }) {
    const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy || fy.companyId !== companyId) throw new NotFoundException('Fiscal Year not found');
    if (fy.isClosed) throw new BadRequestException('This Fiscal Year is already closed');

    return this.prisma.$transaction(async (tx) => {
      let nextFyName = nextFyDto?.name;
      let nextFy;

      if (nextFyDto && nextFyDto.name) {
        let existingNext = await tx.fiscalYear.findUnique({
          where: { name_companyId: { name: nextFyDto.name, companyId } },
        });

        if (existingNext) {
          nextFy = await tx.fiscalYear.update({
            where: { id: existingNext.id },
            data: { isActive: true },
          });
        } else {
          nextFy = await tx.fiscalYear.create({
            data: {
              name: nextFyDto.name,
              startDate: new Date(nextFyDto.startDate),
              endDate: new Date(nextFyDto.endDate),
              isActive: true,
              companyId,
            },
          });
        }
      }

      // Deactivate all fiscal years
      await tx.fiscalYear.updateMany({
        where: { companyId },
        data: { isActive: false },
      });

      // Mark current fiscal year as isClosed
      const closedFy = await tx.fiscalYear.update({
        where: { id },
        data: {
          isClosed: true,
          closedAt: new Date(),
          isActive: false,
        },
      });

      // Activate Next Fiscal Year if created/selected
      if (nextFy) {
        await tx.fiscalYear.update({
          where: { id: nextFy.id },
          data: { isActive: true },
        });
      }

      // Opening Stock Carryforward into Inventory Ledger
      const products = await tx.product.findMany({ where: { companyId } });
      for (const p of products) {
        if (p.stock > 0) {
          await tx.inventoryTransaction.create({
            data: {
              productId: p.id,
              type: 'STOCK_IN',
              quantity: p.stock,
              reason: `Opening Stock Carryforward (${closedFy.name} -> ${nextFyName || 'New Period'})`,
              companyId,
            },
          });
        }
      }

      return {
        message: `Fiscal Year ${closedFy.name} successfully closed. Stock carried forward.`,
        closedFiscalYear: closedFy,
        nextFiscalYear: nextFy || null,
      };
    });
  }
}

