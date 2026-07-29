import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchaseReturnsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: number, userId: number, dto: any) {
    const { purchaseId, reason, items } = dto;
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

    const purchase = await this.prisma.purchase.findUnique({
      where: { id: purchaseId, companyId },
      include: { items: true },
    });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    const count = await this.prisma.purchaseReturn.count({ where: { companyId } });
    const returnNo = `PR-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    return this.prisma.$transaction(async (tx) => {
      let totalRefundAmount = 0;
      const returnItemsData = [];

      for (const returnItem of items) {
        const purchaseItem = purchase.items.find((i) => i.id === returnItem.purchaseItemId);
        if (!purchaseItem) {
          throw new BadRequestException(`PurchaseItem ${returnItem.purchaseItemId} not found in this purchase`);
        }
        if (returnItem.quantity > purchaseItem.quantity || returnItem.quantity <= 0) {
          throw new BadRequestException(`Invalid return quantity for product ID ${purchaseItem.productId}`);
        }

        const refundAmount = purchaseItem.costPrice * returnItem.quantity;
        totalRefundAmount += refundAmount;

        returnItemsData.push({
          purchaseItemId: purchaseItem.id,
          quantity: returnItem.quantity,
          refundAmount: refundAmount,
        });

        // Deduct from stock
        await tx.product.update({
          where: { id: purchaseItem.productId, companyId },
          data: { stock: { decrement: returnItem.quantity } },
        });

        // Log Inventory Transaction
        await tx.inventoryTransaction.create({
          data: {
            productId: purchaseItem.productId,
            quantity: returnItem.quantity,
            type: 'STOCK_OUT',
            reason: 'Purchase Return',
            userId: userId,
            companyId: companyId,
            supplierId: purchase.supplierId,
          },
        });
      }

      // Create PurchaseReturn
      const purchaseReturn = await tx.purchaseReturn.create({
        data: {
          returnNo,
          purchaseId: purchase.id,
          supplierId: purchase.supplierId,
          reason,
          totalAmount: totalRefundAmount,
          companyId,
          items: {
            create: returnItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      return purchaseReturn;
    });
  }

  async findAll(companyId: number) {
    return this.prisma.purchaseReturn.findMany({
      where: { companyId },
      include: {
        purchase: { select: { poNumber: true } },
        supplier: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(companyId: number, id: number) {
    const purchaseReturn = await this.prisma.purchaseReturn.findUnique({
      where: { id, companyId },
      include: {
        items: {
          include: {
            purchaseItem: {
              include: { product: true }
            }
          }
        },
        purchase: true,
        supplier: true,
      },
    });
    if (!purchaseReturn) throw new NotFoundException('Purchase Return not found');
    return purchaseReturn;
  }
}
