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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        let settings = await this.prisma.storeSetting.findFirst();
        if (!settings) {
            settings = await this.prisma.storeSetting.create({
                data: {
                    storeName: 'SmartPOS Default Retail',
                    address: '123 Retail St, Cityville',
                    phone: '+1 555-0100',
                    email: 'store@smartpos.com',
                    taxNumber: 'TAX-000000',
                    currencySymbol: 'Rs.',
                    receiptHeader: 'Thank you for shopping with us!',
                    receiptFooter: 'Please come again!',
                    taxRateDefault: 13.0,
                    invoicePrefix: 'PTRM',
                },
            });
        }
        return settings;
    }
    async updateSettings(dto) {
        const settings = await this.getSettings();
        return this.prisma.storeSetting.update({
            where: { id: settings.id },
            data: dto,
        });
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map