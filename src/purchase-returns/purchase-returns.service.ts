import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchaseReturnsService {
  constructor(private prisma: PrismaService) {}

  private async ensureActiveFiscalYear(companyId: number, txPrisma?: any) {
    const client = txPrisma || this.prisma;
    let activeFy = await client.fiscalYear.findFirst({ where: { isActive: true, companyId } });
    if (!activeFy) {
      const year = new Date().getFullYear();
      activeFy = await client.fiscalYear.create({
        data: {
          name: `${year}/${(year + 1).toString().slice(-2)}`,
          startDate: new Date('2020-01-01T00:00:00.000Z'),
          endDate: new Date('2035-12-31T23:59:59.000Z'),
          isActive: true,
          companyId,
        },
      });
    }
    return activeFy;
  }

  async create(companyId: number, userId: number, dto: any) {
    const { purchaseId, poNumber, reason, items } = dto;
    if (!items || items.length === 0) {
      throw new BadRequestException('No items provided for return');
    }

    await this.ensureActiveFiscalYear(companyId);

    let purchase = null;
    if (purchaseId && !isNaN(Number(purchaseId))) {
      purchase = await this.prisma.purchase.findUnique({
        where: { id: Number(purchaseId), companyId },
        include: { items: { include: { product: true } } },
      });
    } else if (poNumber) {
      purchase = await this.prisma.purchase.findFirst({
        where: { poNumber: String(poNumber).trim(), companyId },
        include: { items: { include: { product: true } } },
      });
    }

    if (!purchase) {
      throw new NotFoundException('Purchase order not found. Please verify the PO Number.');
    }

    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.purchaseReturn.count({ where: { companyId } });
    const returnNo = `PR-${companyId}-${datePrefix}-${(count + 1).toString().padStart(3, '0')}`;

    return this.prisma.$transaction(async (tx) => {
      let totalRefundAmount = 0;
      const returnItemsData = [];

      for (const returnItem of items) {
        const purchaseItem = purchase.items.find((i) => i.id === returnItem.purchaseItemId);
        if (!purchaseItem) {
          throw new BadRequestException(`PurchaseItem ${returnItem.purchaseItemId} not found in this purchase`);
        }

        const returnQty = Math.round(Number(returnItem.quantity) * 1000) / 1000;
        if (isNaN(returnQty) || returnQty <= 0) {
          throw new BadRequestException('Return quantity must be greater than 0');
        }

        // Check already returned quantities for this purchase item
        const previousReturns = await tx.purchaseReturnItem.findMany({
          where: { purchaseItemId: purchaseItem.id },
          select: { quantity: true },
        });
        const alreadyReturnedQty = Math.round(previousReturns.reduce((sum, r) => sum + r.quantity, 0) * 1000) / 1000;
        const remainingReturnableQty = Math.round((purchaseItem.quantity - alreadyReturnedQty) * 1000) / 1000;

        if (returnQty > remainingReturnableQty + 0.0001) {
          throw new BadRequestException(
            `Cannot return ${returnQty} units for product ID ${purchaseItem.productId}. Only ${remainingReturnableQty} unit(s) eligible for return (Purchased: ${purchaseItem.quantity}, Already returned: ${alreadyReturnedQty})`,
          );
        }

        // Check current product stock
        const currentProduct = await tx.product.findUnique({
          where: { id: purchaseItem.productId, companyId },
          select: { stock: true, name: true },
        });
        if (currentProduct && currentProduct.stock < returnQty - 0.0001) {
          throw new BadRequestException(
            `Insufficient stock to return "${currentProduct.name}". Current stock: ${currentProduct.stock}, requested return: ${returnQty}`,
          );
        }

        const refundAmount = Number((purchaseItem.costPrice * returnQty).toFixed(2));
        totalRefundAmount += refundAmount;

        returnItemsData.push({
          purchaseItemId: purchaseItem.id,
          quantity: returnQty,
          refundAmount: refundAmount,
        });

        // Deduct from stock
        await tx.product.update({
          where: { id: purchaseItem.productId, companyId },
          data: { stock: { decrement: returnQty } },
        });

        // Log Inventory Transaction
        await tx.inventoryTransaction.create({
          data: {
            productId: purchaseItem.productId,
            quantity: returnQty,
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

      // Generate Accounting Journal Entry for Purchase Return
      const defaultAccounts = [
        { code: '1000', name: 'Cash on Hand', type: 'ASSET', description: 'Main Cash Account' },
        { code: '1300', name: 'Inventory Asset', type: 'ASSET', description: 'Store Inventory Asset' },
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
          referenceNo: returnNo,
          description: `Purchase Return - ${returnNo} (PO: ${purchase.poNumber})`,
          lines: {
            create: [
              { accountId: accMap['1000'], debit: Number(totalRefundAmount.toFixed(2)), credit: 0, description: 'Cash Refund Received' },
              { accountId: accMap['1300'], debit: 0, credit: Number(totalRefundAmount.toFixed(2)), description: 'Inventory Asset Decreased' },
            ],
          },
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
