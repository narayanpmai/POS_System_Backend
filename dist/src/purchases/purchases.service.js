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
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PurchasesService = class PurchasesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPurchase(companyId, data, userId) {
        const { poNumber, supplierId, totalAmount, purchaseDate, items } = data;
        return this.prisma.$transaction(async (tx) => {
            const purchase = await tx.purchase.create({
                data: {
                    poNumber,
                    supplierId: supplierId || null,
                    totalAmount,
                    purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
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
    async updatePurchase(companyId, id, data, userId) {
        const { poNumber, supplierId, totalAmount, purchaseDate, items } = data;
        return this.prisma.$transaction(async (tx) => {
            const oldPurchase = await tx.purchase.findUnique({
                where: { id },
                include: { items: true }
            });
            if (!oldPurchase || oldPurchase.companyId !== companyId)
                throw new Error('Purchase not found');
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
                        create: items.map((item) => ({
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
    async findAll(companyId) {
        const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true } });
        const where = { companyId };
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
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map