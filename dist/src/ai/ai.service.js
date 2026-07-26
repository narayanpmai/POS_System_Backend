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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AiService = class AiService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSalesPrediction() {
        const sales = await this.prisma.sale.findMany({
            where: {
                createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
            }
        });
        const totalLast30Days = sales.reduce((sum, s) => sum + s.totalAmount, 0);
        const predictedNextMonth = totalLast30Days * 1.15;
        return {
            last30Days: totalLast30Days,
            predictedNext30Days: predictedNextMonth,
            trend: 'UP',
            confidence: 0.85
        };
    }
    async getReorderSuggestions() {
        const products = await this.prisma.product.findMany();
        const suggestions = [];
        for (const p of products) {
            const mockAvgDaily = Math.floor(Math.random() * 5) + 1;
            const threshold = mockAvgDaily * 14;
            if (p.stock < threshold) {
                suggestions.push({
                    productId: p.id,
                    name: p.name,
                    currentStock: p.stock,
                    suggestedOrderQty: threshold * 2,
                    reason: `Stock (${p.stock}) is below 14-day safety threshold (${threshold})`
                });
            }
        }
        return suggestions;
    }
    async getSlowMovingProducts() {
        const products = await this.prisma.product.findMany({
            include: {
                saleItems: {
                    where: {
                        sale: { createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) } }
                    }
                }
            }
        });
        return products.filter(p => p.saleItems.length === 0).map(p => ({
            productId: p.id,
            name: p.name,
            stock: p.stock,
            daysUnsold: 30,
            suggestion: 'Consider applying a 15% discount.'
        }));
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map