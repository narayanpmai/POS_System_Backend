"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesReturnsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SalesReturnsService = class SalesReturnsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, userId, dto) {
        const { saleId, reason, items } = dto;
        if (!items || items.length === 0) {
            throw new common_1.BadRequestException('No items provided for return');
        }
        const sale = await this.prisma.sale.findUnique({
            where: { id: saleId, companyId },
            include: { items: true },
        });
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
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
                    throw new common_1.BadRequestException(`SaleItem ${returnItem.saleItemId} not found in this sale`);
                }
                if (returnItem.quantity > saleItem.quantity || returnItem.quantity <= 0) {
                    throw new common_1.BadRequestException(`Invalid return quantity for product ID ${saleItem.productId}`);
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
                await tx.product.update({
                    where: { id: saleItem.productId, companyId },
                    data: { stock: { increment: returnItem.quantity } },
                });
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
    async findAll(companyId) {
        return this.prisma.saleReturn.findMany({
            where: { companyId },
            include: {
                sale: { select: { invoiceNo: true } },
                customer: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(companyId, id) {
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
        if (!saleReturn)
            throw new common_1.NotFoundException('Sale Return not found');
        return saleReturn;
    }
};
exports.SalesReturnsService = SalesReturnsService;
exports.SalesReturnsService = SalesReturnsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalesReturnsService);
//# sourceMappingURL=sales-returns.service.js.map