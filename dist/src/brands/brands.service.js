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
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}
let BrandsService = class BrandsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, dto) {
        const slug = slugify(dto.name);
        const existing = await this.prisma.brand.findFirst({
            where: {
                companyId,
                OR: [
                    { name: dto.name },
                    { slug: slug }
                ]
            }
        });
        if (existing) {
            throw new common_1.BadRequestException('A brand with this name or slug already exists');
        }
        return this.prisma.brand.create({
            data: {
                name: dto.name,
                slug,
                status: dto.status || 'ACTIVE',
                companyId,
            }
        });
    }
    async findAll(companyId, search) {
        const where = { companyId };
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { slug: { contains: search } }
            ];
        }
        return this.prisma.brand.findMany({
            where,
            orderBy: { id: 'asc' },
        });
    }
    async findOne(companyId, id) {
        const brand = await this.prisma.brand.findUnique({ where: { id } });
        if (!brand || brand.companyId !== companyId)
            throw new common_1.NotFoundException('Brand not found');
        return brand;
    }
    async update(companyId, id, dto) {
        await this.findOne(companyId, id);
        const data = { ...dto };
        if (dto.name) {
            const slug = slugify(dto.name);
            const existing = await this.prisma.brand.findFirst({
                where: {
                    AND: [
                        { id: { not: id } },
                        { companyId },
                        {
                            OR: [
                                { name: dto.name },
                                { slug: slug }
                            ]
                        }
                    ]
                }
            });
            if (existing) {
                throw new common_1.BadRequestException('Another brand with this name or slug already exists');
            }
            data.slug = slug;
        }
        return this.prisma.brand.update({
            where: { id },
            data,
        });
    }
    async remove(companyId, id) {
        await this.findOne(companyId, id);
        const linkedProducts = await this.prisma.product.count({ where: { brandId: id } });
        if (linkedProducts > 0) {
            throw new common_1.BadRequestException('Cannot delete a brand that has associated products');
        }
        return this.prisma.brand.delete({ where: { id } });
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BrandsService);
//# sourceMappingURL=brands.service.js.map