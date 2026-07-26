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
exports.PurchaseReturnsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PurchaseReturnsService = class PurchaseReturnsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, userId, dto) {
        const { purchaseId, reason, items } = dto;
        if (!items || items.length === 0) {
            throw new common_1.BadRequestException('No items provided for return');
        }
        const purchase = await this.prisma.purchase.findUnique({
            where: { id: purchaseId, companyId },
            include: { items: true },
        });
        if (!purchase) {
            throw new common_1.NotFoundException('Purchase not found');
        }
        const count = await this.prisma.purchaseReturn.count({ where: { companyId } });
        const returnNo = `PR-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
        return this.prisma.$transaction(async (tx) => {
            let totalRefundAmount = 0;
            const returnItemsData = [];
            for (const returnItem of items) {
                const purchaseItem = purchase.items.find((i) => i.id === returnItem.purchaseItemId);
                if (!purchaseItem) {
                    throw new common_1.BadRequestException(`PurchaseItem ${returnItem.purchaseItemId} not found in this purchase`);
                }
                if (returnItem.quantity > purchaseItem.quantity || returnItem.quantity <= 0) {
                    throw new common_1.BadRequestException(`Invalid return quantity for product ID ${purchaseItem.productId}`);
                }
                const refundAmount = purchaseItem.costPrice * returnItem.quantity;
                totalRefundAmount += refundAmount;
                returnItemsData.push({
                    purchaseItemId: purchaseItem.id,
                    quantity: returnItem.quantity,
                    refundAmount: refundAmount,
                });
                await tx.product.update({
                    where: { id: purchaseItem.productId, companyId },
                    data: { stock: { decrement: returnItem.quantity } },
                });
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
    async findAll(companyId) {
        return this.prisma.purchaseReturn.findMany({
            where: { companyId },
            include: {
                purchase: { select: { poNumber: true } },
                supplier: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(companyId, id) {
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
        if (!purchaseReturn)
            throw new common_1.NotFoundException('Purchase Return not found');
        return purchaseReturn;
    }
};
exports.PurchaseReturnsService = PurchaseReturnsService;
exports.PurchaseReturnsService = PurchaseReturnsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PurchaseReturnsService);
//# sourceMappingURL=purchase-returns.service.js.map