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
exports.FiscalYearsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FiscalYearsService = class FiscalYearsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(companyId) {
        return this.prisma.fiscalYear.findMany({
            where: { companyId },
            orderBy: { startDate: 'desc' }
        });
    }
    async findActive(companyId) {
        return this.prisma.fiscalYear.findFirst({
            where: { isActive: true, companyId }
        });
    }
    async create(companyId, createDto) {
        const existing = await this.prisma.fiscalYear.findUnique({ where: { name_companyId: { name: createDto.name, companyId } } });
        if (existing)
            throw new common_1.BadRequestException('Fiscal Year name already exists');
        if (createDto.isActive) {
            await this.prisma.fiscalYear.updateMany({ where: { companyId }, data: { isActive: false } });
        }
        return this.prisma.fiscalYear.create({
            data: {
                name: createDto.name,
                startDate: new Date(createDto.startDate),
                endDate: new Date(createDto.endDate),
                isActive: createDto.isActive || false,
                companyId
            }
        });
    }
    async update(companyId, id, updateDto) {
        const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
        if (!fy || fy.companyId !== companyId)
            throw new common_1.NotFoundException('Fiscal Year not found');
        if (updateDto.isActive) {
            await this.prisma.fiscalYear.updateMany({ where: { companyId }, data: { isActive: false } });
        }
        const data = { ...updateDto };
        if (updateDto.startDate)
            data.startDate = new Date(updateDto.startDate);
        if (updateDto.endDate)
            data.endDate = new Date(updateDto.endDate);
        return this.prisma.fiscalYear.update({
            where: { id },
            data
        });
    }
    async setActive(companyId, id) {
        const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
        if (!fy || fy.companyId !== companyId)
            throw new common_1.NotFoundException('Fiscal Year not found');
        await this.prisma.fiscalYear.updateMany({
            where: { companyId },
            data: { isActive: false }
        });
        return this.prisma.fiscalYear.update({
            where: { id },
            data: { isActive: true }
        });
    }
    async delete(companyId, id) {
        const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
        if (!fy || fy.companyId !== companyId)
            throw new common_1.NotFoundException('Fiscal Year not found');
        if (fy.isActive)
            throw new common_1.BadRequestException('Cannot delete an active Fiscal Year');
        return this.prisma.fiscalYear.delete({ where: { id } });
    }
};
exports.FiscalYearsService = FiscalYearsService;
exports.FiscalYearsService = FiscalYearsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FiscalYearsService);
//# sourceMappingURL=fiscal-years.service.js.map