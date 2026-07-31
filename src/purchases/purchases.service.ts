import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { buildPaginatedResponse } from '../common/interfaces/api-response.interface';

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
    if (activeFy.isClosed) {
      throw new BadRequestException('The active fiscal year is closed. Financial entries are locked.');
    }
    const txDate = purchaseDate ? new Date(purchaseDate) : new Date();
    if (txDate < activeFy.startDate || txDate > activeFy.endDate) {
      throw new BadRequestException(`Transaction date must fall within the active fiscal year (${activeFy.name})`);
    }

    const closedFy = await this.prisma.fiscalYear.findFirst({
      where: { companyId, isClosed: true, startDate: { lte: txDate }, endDate: { gte: txDate } },
    });
    if (closedFy) {
      throw new BadRequestException(`Cannot record entries in closed Fiscal Year "${closedFy.name}". Financial ledger is locked.`);
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

      // Update inventory and WACP based on received items
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId, companyId }
        });

        if (product) {
          const oldStock = Math.max(0, product.stock);
          const oldCost = product.cost || 0;
          const newQty = item.quantity;
          const newPrice = item.costPrice;
          const totalStock = oldStock + newQty;

          const newWacp = totalStock > 0
            ? Number((((oldStock * oldCost) + (newQty * newPrice)) / totalStock).toFixed(2))
            : newPrice;

          await tx.product.update({
            where: { id: item.productId, companyId },
            data: { 
              stock: { increment: item.quantity },
              cost: newWacp, // Auto-calculated Weighted Average Cost Price
              unit: item.measurementUnit || product.unit || 'pcs'
            }
          });
        }

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

      // Accounting: Generate Double-Entry Journal Entry
      const defaultAccounts = [
        { code: '1000', name: 'Cash on Hand', type: 'ASSET', description: 'Main Cash Account' },
        { code: '1300', name: 'Inventory Asset', type: 'ASSET', description: 'Store Inventory Asset' },
        { code: '2000', name: 'Accounts Payable', type: 'LIABILITY', description: 'Supplier Payables' },
      ];

      const accMap: Record<string, number> = {};
      for (const acc of defaultAccounts) {
        let existing = await tx.account.findFirst({ where: { code: acc.code, companyId } });
        if (!existing) {
          existing = await tx.account.create({
            data: { code: acc.code, name: acc.name, type: acc.type, description: acc.description, companyId },
          });
        }
        accMap[acc.code] = existing.id;
      }

      await tx.journalEntry.create({
        data: {
          companyId,
          referenceNo: poNumber,
          description: `Inventory Purchase - ${poNumber}`,
          lines: {
            create: [
              { accountId: accMap['1300'], debit: Number(totalAmount), credit: 0, description: 'Inventory Asset Increase' },
              { accountId: accMap['1000'], debit: 0, credit: Number(totalAmount), description: 'Cash Paid for Purchase' },
            ],
          },
        },
      });

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

  async findAll(companyId: number, query: { page?: number; limit?: number; search?: string } = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(500, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true, companyId } });
    const where: any = { companyId };
    if (activeFy) {
      where.purchaseDate = {
        gte: activeFy.startDate,
        lte: activeFy.endDate
      };
    }

    if (query.search) {
      where.OR = [
        { poNumber: { contains: query.search, mode: 'insensitive' } },
        { supplier: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.purchase.findMany({
        where,
        include: {
          supplier: true,
          user: true,
          items: { include: { product: true } }
        },
        orderBy: { purchaseDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.purchase.count({ where }),
    ]);

    return buildPaginatedResponse(items, total, page, limit);
  }
}
