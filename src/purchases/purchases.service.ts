import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async createPurchase(user: any, data: any) {
    // Basic logic to create purchase
    const { poNumber, supplierId, totalAmount, purchaseDate, items } = data;
    
    return this.prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          poNumber,
          supplierId: supplierId || null,
          totalAmount,
          purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
          userId: user.id,
          companyId: user.companyId,
          status: 'RECEIVED',
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
          where: { id: item.productId },
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
            userId: user.id,
            companyId: user.companyId,
          }
        });
      }

      return purchase;
    });
  }

  async updatePurchase(user: any, id: number, data: any) {
    const { poNumber, supplierId, totalAmount, purchaseDate, items } = data;
    
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch old purchase
      const oldPurchase = await tx.purchase.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!oldPurchase || oldPurchase.companyId !== user.companyId) throw new Error('Purchase not found');

      // 2. Reverse inventory for old items
      for (const oldItem of oldPurchase.items) {
        await tx.product.update({
          where: { id: oldItem.productId },
          data: { stock: { decrement: oldItem.quantity } }
        });

        await tx.inventoryTransaction.create({
          data: {
            productId: oldItem.productId,
            type: 'STOCK_OUT',
            quantity: oldItem.quantity,
            reason: `Purchase Reversal/Edit ${oldPurchase.poNumber}`,
            supplierId: oldPurchase.supplierId || null,
            userId: user.id,
            companyId: user.companyId,
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

      // 4. Apply inventory for new items
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
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
            reason: `Purchase Edit ${poNumber}`,
            supplierId: supplierId || null,
            userId: user.id,
            companyId: user.companyId,
          }
        });
      }

      return updatedPurchase;
    });
  }

  async findAll(user: any) {
    const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true } });
    const where: any = { companyId: user.companyId };
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
