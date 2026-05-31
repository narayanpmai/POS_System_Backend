import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/sales.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async checkout(dto: CreateSaleDto, cashierId: number) {
    if (dto.items.length === 0) {
      throw new BadRequestException('Cannot complete sale with empty cart');
    }

    // 1. Calculate values and validate stocks
    let subtotal = 0;
    let taxAmount = 0;
    const itemsToCreate = [];
    const stockUpdates = [];
    const inventoryLogs = [];

    // Retrieve default tax configuration if needed
    const settings = await this.prisma.storeSetting.findUnique({ where: { id: 1 } });
    const defaultTaxRate = settings?.taxRateDefault || 0.0;

    for (const itemDto of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: itemDto.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${itemDto.productId} not found`);
      }

      if (product.stock < itemDto.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${itemDto.quantity}`
        );
      }

      const itemPrice = product.price;
      const itemCost = product.cost;
      const itemSubtotal = itemPrice * itemDto.quantity;
      
      // Calculate tax for this item based on product specific tax rate
      const taxRateToApply = product.taxRate !== undefined ? product.taxRate : defaultTaxRate;
      const itemTax = itemSubtotal * (taxRateToApply / 100);
      const itemTotal = itemSubtotal + itemTax;

      subtotal += itemSubtotal;
      taxAmount += itemTax;

      itemsToCreate.push({
        productId: product.id,
        quantity: itemDto.quantity,
        price: itemPrice,
        cost: itemCost,
        taxAmount: Number(itemTax.toFixed(2)),
        total: Number(itemTotal.toFixed(2)),
      });

      // Prepare stock adjustments and stock-out logs
      stockUpdates.push({
        id: product.id,
        newStock: product.stock - itemDto.quantity,
      });

      inventoryLogs.push({
        productId: product.id,
        type: 'STOCK_OUT' as const,
        quantity: itemDto.quantity,
        reason: 'POS Sale Outflow',
        userId: cashierId,
      });
    }

    const discountAmount = dto.discountAmount || 0;
    const totalAmount = Number((subtotal + taxAmount - discountAmount).toFixed(2));

    if (totalAmount < 0) {
      throw new BadRequestException('Discount cannot be larger than the total sale amount');
    }

    // 2. Generate unique Invoice Number (Format: Prefix-YYYYMMDD-XXXXX)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.floor(10000 + Math.random() * 90000).toString();
    const prefix = settings?.invoicePrefix || 'INV';
    const invoiceNo = `${prefix}-${dateStr}-${randStr}`;

    // 3. Complete database transaction
    return await this.prisma.$transaction(async (tx) => {
      // Create Sale Header
      const sale = await tx.sale.create({
        data: {
          invoiceNo,
          customerId: dto.customerId || null,
          cashierId,
          subtotal: Number(subtotal.toFixed(2)),
          taxAmount: Number(taxAmount.toFixed(2)),
          discountAmount: Number(discountAmount.toFixed(2)),
          totalAmount: totalAmount,
          paymentMethod: dto.paymentMethod,
          paymentStatus: 'PAID',
          items: {
            create: itemsToCreate,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
          cashier: {
            select: { name: true, email: true },
          },
          customer: true,
        },
      });

      // Deduct product stock and log transaction
      for (let i = 0; i < stockUpdates.length; i++) {
        const update = stockUpdates[i];
        const log = inventoryLogs[i];

        await tx.product.update({
          where: { id: update.id },
          data: { stock: update.newStock },
        });

        await tx.inventoryTransaction.create({
          data: {
            productId: log.productId,
            type: log.type,
            quantity: log.quantity,
            reason: `${log.reason} - Invoice ${invoiceNo}`,
            userId: log.userId,
          },
        });
      }

      // Customer Loyalty Points: 1 point for every $10 total amount spent
      if (dto.customerId) {
        const pointsEarned = Math.floor(totalAmount / 10);
        if (pointsEarned > 0) {
          await tx.customer.update({
            where: { id: dto.customerId },
            data: {
              points: {
                increment: pointsEarned,
              },
            },
          });
        }
      }

      return sale;
    });
  }

  async findAllSales(query: {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { invoiceNo: { contains: query.search, mode: 'insensitive' } },
        { paymentMethod: { contains: query.search, mode: 'insensitive' } },
        { customer: { name: { contains: query.search, mode: 'insensitive' } } },
        { cashier: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        where.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999); // include entire end day
        where.createdAt.lte = end;
      }
    } else {
      const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true } });
      if (activeFy) {
        where.createdAt = {
          gte: activeFy.startDate,
          lte: activeFy.endDate
        };
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        include: {
          customer: true,
          cashier: { select: { name: true } },
          items: { include: { product: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.sale.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findSaleById(id: number) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        cashier: { select: { name: true, email: true } },
        items: {
          include: { product: true },
        },
      },
    });
    if (!sale) throw new NotFoundException('Transaction not found');
    return sale;
  }
}
