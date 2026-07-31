import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}

  async startShift(companyId: number, userId: number, cashStart: number) {
    const existingOpenShift = await this.prisma.shift.findFirst({
      where: { companyId, employeeId: userId, status: 'OPEN' },
    });

    if (existingOpenShift) {
      return existingOpenShift;
    }

    return this.prisma.shift.create({
      data: {
        employeeId: userId,
        cashStart: Number(cashStart) || 0,
        status: 'OPEN',
        companyId,
      },
    });
  }

  async getCurrentShift(companyId: number, userId: number) {
    return this.prisma.shift.findFirst({
      where: { companyId, employeeId: userId, status: 'OPEN' },
      include: { employee: { select: { name: true, email: true } } },
    });
  }

  async closeShift(companyId: number, userId: number, cashEnd: number) {
    const shift = await this.prisma.shift.findFirst({
      where: { companyId, employeeId: userId, status: 'OPEN' },
    });

    if (!shift) {
      throw new NotFoundException('No active open shift found for this user');
    }

    // Calculate total cash sales conducted by this cashier during this shift
    const cashSales = await this.prisma.sale.aggregate({
      where: {
        companyId,
        cashierId: userId,
        paymentMethod: 'CASH',
        createdAt: { gte: shift.startTime },
      },
      _sum: { totalAmount: true },
    });

    const totalCashSales = cashSales._sum.totalAmount || 0;
    const expectedCash = shift.cashStart + totalCashSales;
    const countCash = Number(cashEnd) || 0;
    const variance = countCash - expectedCash;

    const closedShift = await this.prisma.shift.update({
      where: { id: shift.id },
      data: {
        cashEnd: countCash,
        endTime: new Date(),
        status: 'CLOSED',
      },
    });

    return {
      shift: closedShift,
      cashStart: shift.cashStart,
      totalCashSales,
      expectedCash,
      actualCountedCash: countCash,
      variance,
      isBalanced: Math.abs(variance) < 0.01,
    };
  }
}
