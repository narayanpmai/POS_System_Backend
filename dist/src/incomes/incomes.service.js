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
exports.IncomesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let IncomesService = class IncomesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, dto) {
        return this.prisma.income.create({
            data: {
                referenceNo: dto.referenceNo,
                category: dto.category,
                amount: dto.amount,
                description: dto.description,
                date: dto.date ? new Date(dto.date) : new Date(),
                companyId,
            }
        });
    }
    async findAll(companyId, search, category) {
        const where = { companyId };
        if (search) {
            where.OR = [
                { referenceNo: { contains: search } },
                { description: { contains: search } }
            ];
        }
        if (category) {
            where.category = category;
        }
        const activeFy = await this.prisma.fiscalYear.findFirst({ where: { isActive: true, companyId } });
        if (activeFy) {
            where.date = {
                gte: activeFy.startDate,
                lte: activeFy.endDate
            };
        }
        return this.prisma.income.findMany({
            where,
            orderBy: { date: 'desc' },
        });
    }
    async findOne(companyId, id) {
        const income = await this.prisma.income.findUnique({ where: { id } });
        if (!income || income.companyId !== companyId)
            throw new common_1.NotFoundException('Income not found');
        return income;
    }
    async update(companyId, id, dto) {
        await this.findOne(companyId, id);
        const data = { ...dto };
        if (dto.date) {
            data.date = new Date(dto.date);
        }
        return this.prisma.income.update({
            where: { id },
            data,
        });
    }
    async remove(companyId, id) {
        await this.findOne(companyId, id);
        return this.prisma.income.delete({ where: { id } });
    }
};
exports.IncomesService = IncomesService;
exports.IncomesService = IncomesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IncomesService);
//# sourceMappingURL=incomes.service.js.map