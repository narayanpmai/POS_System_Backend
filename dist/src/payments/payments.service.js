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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const sales_service_1 = require("../sales/sales.service");
let PaymentsService = class PaymentsService {
    constructor(prisma, salesService) {
        this.prisma = prisma;
        this.salesService = salesService;
    }
    async processPayment(companyId, data) {
        const isSuccess = Math.random() > 0.1;
        if (!isSuccess) {
            throw new common_1.BadRequestException('Payment gateway declined the transaction.');
        }
        const transactionRef = `${data.provider}-TXN-${Date.now()}`;
        let sale = null;
        if (data.saleDto && data.cashierId) {
            data.saleDto.paymentMethod = data.provider;
            sale = await this.salesService.checkout(companyId, data.saleDto, data.cashierId);
        }
        const pt = await this.prisma.paymentTransaction.create({
            data: {
                provider: data.provider,
                transactionRef,
                amount: data.amount,
                status: 'SUCCESS',
                saleId: sale ? sale.id : null,
                companyId,
            }
        });
        return {
            message: 'Payment processed successfully',
            transactionRef,
            sale
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        sales_service_1.SalesService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map