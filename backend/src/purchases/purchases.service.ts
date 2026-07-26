import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async createPurchase(companyId: number, data: any, userId: number) {
    // Basic logic to create purchase
    const { poNumber, supplierId, totalAmount, purchaseDate, items } = data;
    
    const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true, companyId } });
    if (!activeFy) {
      throw new BadRequestException('No active fiscal year found. Please activate a fiscal year first.');
    }
    const txDate = purchaseDate ? new Date(purchaseDate) : new Date();
    if (txDate < activeFy.startDate || txDate > activeFy.endDate) {
      throw new BadRequestException(`Transaction date must fall within the active fiscal year (${activeFy.name})`);
    }

    return this.prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          poNumber,
          supplierId: supplierId || null,
          totalAmount,
          purchaseDate: txDate,
          userId,
          status: 'RECEIVED',
          companyId,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              costPrice: item.costPrice,
              total: item.quantity * item.costPrice,
              measurementUnit: item.measurementUnit || 'pcs'
            }))
          }
        },
        include: { items: true }
      });

      // Update inventory based on received items
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId, companyId },
          data: { 
            stock: { increment: item.quantity },
            cost: item.costPrice, // Update the last cost price
            unit: item.measurementUnit || 'pcs' // Update the measurement unit if provided
          }
        });

        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            type: 'STOCK_IN',
            quantity: item.quantity,
            reason: `Purchase ${poNumber}`,
            supplierId: supplierId || null,
            userId: userId,
            companyId,
          }
        });
      }

      return purchase;
    });
  }

  async updatePurchase(companyId: number, id: number, data: any, userId: number) {
    const { poNumber, supplierId, totalAmount, purchaseDate, items } = data;
    
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch old purchase
      const oldPurchase = await tx.purchase.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!oldPurchase || oldPurchase.companyId !== companyId) throw new Error('Purchase not found');

      // 2. Reverse inventory for old items
      for (const oldItem of oldPurchase.items) {
        await tx.product.update({
          where: { id: oldItem.productId, companyId },
          data: { stock: { decrement: oldItem.quantity } }
        });

        await tx.inventoryTransaction.create({
          data: {
            productId: oldItem.productId,
            type: 'STOCK_OUT',
            quantity: oldItem.quantity,
            reason: `Purchase Reversal/Edit ${oldPurchase.poNumber}`,
            supplierId: oldPurchase.supplierId || null,
            userId: userId,
            companyId,
          }
        });
      }

      // 3. Delete old items and update purchase record
      await tx.purchaseItem.deleteMany({
        where: { purchaseId: id }
      });

      const updatedPurchase = await tx.purchase.update({
        where: { id },
        data: {
          poNumber,
          supplierId: supplierId || null,
          totalAmount,
          purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              costPrice: item.costPrice,
              total: item.quantity * item.costPrice,
              measurementUnit: item.measurementUnit || 'pcs'
            }))
          }
        },
        include: { items: true }
      });

      // 4. Create new items and update inventory
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId, companyId },
          data: { 
            stock: { increment: item.quantity },
            cost: item.costPrice,
            unit: item.measurementUnit || 'pcs'
          }
        });

        await tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            type: 'STOCK_IN',
            quantity: item.quantity,
            reason: `Purchase Edit Re-stock ${poNumber}`,
            supplierId: supplierId || null,
            userId: userId,
            companyId,
          }
        });
      }

      return updatedPurchase;
    });
  }

  async findAll(companyId: number) {
    const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true, companyId } });
    const where: any = { companyId };
    if (activeFy) {
      where.purchaseDate = {
        gte: activeFy.startDate,
        lte: activeFy.endDate
      };
    }

    return this.prisma.purchase.findMany({
      where,
      include: {
        supplier: true,
        user: true,
        items: { include: { product: true } }
      },
      orderBy: { purchaseDate: 'desc' }
    });
  }
}
