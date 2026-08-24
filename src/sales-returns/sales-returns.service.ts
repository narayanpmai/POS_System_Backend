import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalesReturnsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, userId: number, dto: any) {
    const { saleId, invoiceNo, reason, items } = dto;
    if (!items || items.length === 0) {
      throw new BadRequestException('No items provided for return');
    }

    const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true, companyId } });
    if (!activeFy) {
      throw new BadRequestException('No active fiscal year found. Please activate a fiscal year first.');
    }
    const txDate = new Date();
    if (txDate < activeFy.startDate || txDate > activeFy.endDate) {
      throw new BadRequestException(`Transaction date must fall within the active fiscal year (${activeFy.name})`);
    }

    let sale = null;
    if (saleId && !isNaN(Number(saleId))) {
      sale = await this.prisma.sale.findUnique({
        where: { id: Number(saleId), companyId },
        include: { items: true },
      });
    } else if (invoiceNo) {
      sale = await this.prisma.sale.findFirst({
        where: { invoiceNo: String(invoiceNo).trim(), companyId },
        include: { items: true },
      });
    }

    if (!sale) {
      throw new NotFoundException('Sale transaction not found. Please verify the Invoice Number.');
    }

    const count = await this.prisma.saleReturn.count({ where: { companyId } });
    const returnNo = `SR-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    return this.prisma.$transaction(async (tx) => {
      let totalReturnSubtotal = 0;
      let totalReturnTax = 0;
      let totalReturnTotal = 0;
      const itemsToCreate = [];

      for (const returnItem of items) {
        const saleItem = sale.items.find((i) => i.id === returnItem.saleItemId);
        if (!saleItem) {
          throw new BadRequestException(`SaleItem ${returnItem.saleItemId} not found in this sale`);
        }
        if (returnItem.quantity > saleItem.quantity || returnItem.quantity <= 0) {
          throw new BadRequestException(`Invalid return quantity for product ID ${saleItem.productId}`);
        }

        const refundSubtotal = saleItem.price * returnItem.quantity;
        const refundTax = (saleItem.taxAmount / saleItem.quantity) * returnItem.quantity;
        const refundTotal = refundSubtotal + refundTax;

        totalReturnSubtotal += refundSubtotal;
        totalReturnTax += refundTax;
        totalReturnTotal += refundTotal;

        itemsToCreate.push({
          saleItemId: saleItem.id,
          quantity: returnItem.quantity,
          refundAmount: refundTotal,
        });

        // 1. Update product stock
        await tx.product.update({
          where: { id: saleItem.productId, companyId },
          data: { stock: { increment: returnItem.quantity } },
        });

        // 2. Log inventory transaction
        await tx.inventoryTransaction.create({
          data: {
            productId: saleItem.productId,
            type: 'STOCK_IN',
            quantity: returnItem.quantity,
            reason: `Sale Return ${returnNo} (Sale: ${sale.invoiceNo})`,
            userId,
            companyId,
          }
        });
      }

      // 3. Create Sale Return Header
      const saleReturn = await tx.saleReturn.create({
        data: {
          returnNo,
          saleId: dto.saleId,
          customerId: sale.customerId,
          reason: dto.reason,
          totalAmount: Number(totalReturnTotal.toFixed(2)),
          companyId,
          items: {
            create: itemsToCreate
          }
        },
        include: {
          items: true,
        },
      });

      return saleReturn;
    });
  }

  async findAll(companyId: number) {
    return this.prisma.saleReturn.findMany({
      where: { companyId },
      include: {
        sale: { select: { invoiceNo: true } },
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(companyId: number, id: number) {
    const saleReturn = await this.prisma.saleReturn.findUnique({
      where: { id, companyId },
      include: {
        items: {
          include: {
            saleItem: {
              include: { product: true }
            }
          }
        },
        sale: true,
        customer: true,
      },
    });
    if (!saleReturn) throw new NotFoundException('Sale Return not found');
    return saleReturn;
  }
}
