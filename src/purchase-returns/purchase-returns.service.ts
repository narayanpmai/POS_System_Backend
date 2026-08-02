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
    const { purchaseId, reason, items } = dto;
    if (!items || items.length === 0) {
      throw new BadRequestException('No items provided for return');
    }

    await this.ensureActiveFiscalYear(companyId);

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
