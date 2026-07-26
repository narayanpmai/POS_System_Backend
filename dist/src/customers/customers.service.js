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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomersService = class CustomersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, dto) {
        if (dto.phone) {
            const exists = await this.prisma.customer.findUnique({
                where: { phone_companyId: { phone: dto.phone, companyId } },
            });
            if (exists) {
                throw new common_1.BadRequestException('A customer with this phone number is already registered');
            }
        }
        return this.prisma.customer.create({ data: { ...dto, companyId } });
    }
    async findAll(companyId, query) {
        const page = Math.max(1, query.page || 1);
        const limit = Math.max(1, query.limit || 10);
        const skip = (page - 1) * limit;
        const where = { companyId };
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
                { phone: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            this.prisma.customer.findMany({
                where,
                include: { membershipTier: true },
                orderBy: { name: 'asc' },
                skip,
                take: limit,
            }),
            this.prisma.customer.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
            include: {
                sales: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return customer;
    }
    async findByPhone(companyId, phone) {
        const customer = await this.prisma.customer.findUnique({
            where: { phone_companyId: { phone, companyId } },
        });
        if (!customer)
            throw new common_1.NotFoundException(`Customer with phone number ${phone} not found`);
        return customer;
    }
    async update(companyId, id, dto) {
        const current = await this.findOne(id);
        if (dto.phone && dto.phone !== current.phone) {
            const exists = await this.prisma.customer.findUnique({
                where: { phone_companyId: { phone: dto.phone, companyId } },
            });
            if (exists) {
                throw new common_1.BadRequestException('A customer with this phone number is already registered');
            }
        }
        return this.prisma.customer.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        const salesCount = await this.prisma.sale.count({
            where: { customerId: id },
        });
        if (salesCount > 0) {
            throw new common_1.BadRequestException('Cannot delete customer with active transaction history. Consider cleaning or updating profile instead.');
        }
        return this.prisma.customer.delete({ where: { id } });
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map