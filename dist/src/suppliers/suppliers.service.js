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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SuppliersService = class SuppliersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, dto) {
        if (dto.phone) {
            const existing = await this.prisma.supplier.findFirst({
                where: { phone: dto.phone, companyId }
            });
            if (existing) {
                throw new common_1.BadRequestException('A supplier with this phone number already exists');
            }
        }
        return this.prisma.supplier.create({
            data: {
                name: dto.name,
                email: dto.email,
                phone: dto.phone,
                address: dto.address,
                companyId,
            }
        });
    }
    async findAll(companyId, search, page = 1, limit = 100) {
        const where = { companyId };
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { phone: { contains: search } },
                { email: { contains: search } }
            ];
        }
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.supplier.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'desc' },
            }),
            this.prisma.supplier.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(companyId, id) {
        const supplier = await this.prisma.supplier.findUnique({ where: { id } });
        if (!supplier || supplier.companyId !== companyId)
            throw new common_1.NotFoundException('Supplier not found');
        return supplier;
    }
    async update(companyId, id, dto) {
        await this.findOne(companyId, id);
        if (dto.phone) {
            const existing = await this.prisma.supplier.findFirst({
                where: {
                    phone: dto.phone,
                    companyId,
                    id: { not: id }
                }
            });
            if (existing) {
                throw new common_1.BadRequestException('Another supplier with this phone number already exists');
            }
        }
        return this.prisma.supplier.update({
            where: { id },
            data: dto,
        });
    }
    async remove(companyId, id) {
        await this.findOne(companyId, id);
        const linkedPurchases = await this.prisma.purchase.count({ where: { supplierId: id } });
        const linkedTransactions = await this.prisma.inventoryTransaction.count({ where: { supplierId: id } });
        if (linkedPurchases > 0 || linkedTransactions > 0) {
            throw new common_1.BadRequestException('Cannot delete supplier with associated purchase history or inventory ledgers');
        }
        return this.prisma.supplier.delete({ where: { id } });
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map