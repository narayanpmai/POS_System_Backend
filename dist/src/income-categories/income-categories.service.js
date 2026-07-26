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
exports.IncomeCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let IncomeCategoriesService = class IncomeCategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, dto) {
        const existing = await this.prisma.incomeCategory.findFirst({
            where: { name: dto.name, companyId }
        });
        if (existing) {
            throw new common_1.BadRequestException('An income category with this name already exists');
        }
        return this.prisma.incomeCategory.create({
            data: {
                name: dto.name,
                description: dto.description,
                companyId,
            }
        });
    }
    async findAll(companyId, search) {
        const where = { companyId };
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } }
            ];
        }
        return this.prisma.incomeCategory.findMany({
            where,
            orderBy: { id: 'asc' },
        });
    }
    async findOne(companyId, id) {
        const category = await this.prisma.incomeCategory.findUnique({ where: { id, companyId } });
        if (!category)
            throw new common_1.NotFoundException('Income category not found');
        return category;
    }
    async update(companyId, id, dto) {
        await this.findOne(companyId, id);
        if (dto.name) {
            const existing = await this.prisma.incomeCategory.findFirst({
                where: {
                    name: dto.name,
                    companyId,
                    id: { not: id }
                }
            });
            if (existing) {
                throw new common_1.BadRequestException('Another income category with this name already exists');
            }
        }
        return this.prisma.incomeCategory.update({
            where: { id },
            data: dto,
        });
    }
    async remove(companyId, id) {
        const cat = await this.findOne(companyId, id);
        const linkedIncomes = await this.prisma.income.count({
            where: { category: cat.name, companyId }
        });
        if (linkedIncomes > 0) {
            throw new common_1.BadRequestException('Cannot delete an income category that has associated incomes logged');
        }
        return this.prisma.incomeCategory.delete({ where: { id } });
    }
};
exports.IncomeCategoriesService = IncomeCategoriesService;
exports.IncomeCategoriesService = IncomeCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IncomeCategoriesService);
//# sourceMappingURL=income-categories.service.js.map