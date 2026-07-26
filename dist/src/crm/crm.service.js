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
exports.CrmService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CrmService = class CrmService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTiers() {
        return this.prisma.membershipTier.findMany({
            orderBy: { minPoints: 'asc' }
        });
    }
    async getCustomerCrmData(customerId) {
        const customer = await this.prisma.customer.findUnique({
            where: { id: customerId },
            include: {
                membershipTier: true,
                rewardPointHistories: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return customer;
    }
    async adjustWallet(customerId, amount, reason) {
        return this.prisma.customer.update({
            where: { id: customerId },
            data: {
                walletBalance: { increment: amount }
            }
        });
    }
    async addRewardPoints(customerId, points, reason) {
        const customer = await this.prisma.customer.update({
            where: { id: customerId },
            data: {
                points: { increment: points },
                rewardPointHistories: {
                    create: { points, reason }
                }
            },
            include: { membershipTier: true }
        });
        const tiers = await this.getTiers();
        const eligibleTier = tiers.reverse().find(t => customer.points >= t.minPoints);
        if (eligibleTier && customer.membershipTierId !== eligibleTier.id) {
            await this.prisma.customer.update({
                where: { id: customerId },
                data: { membershipTierId: eligibleTier.id }
            });
        }
        return customer;
    }
};
exports.CrmService = CrmService;
exports.CrmService = CrmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CrmService);
//# sourceMappingURL=crm.service.js.map