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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCategory(companyId, dto) {
        const exists = await this.prisma.category.findUnique({
            where: { name_companyId: { name: dto.name, companyId } },
        });
        if (exists) {
            throw new common_1.BadRequestException('Category name already exists');
        }
        return this.prisma.category.create({ data: { ...dto, companyId } });
    }
    async findAllCategories(companyId) {
        return this.prisma.category.findMany({
            where: { companyId },
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { name: 'asc' },
        });
    }
    async findCategoryById(companyId, id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { products: true },
        });
        if (!category || category.companyId !== companyId)
            throw new common_1.NotFoundException('Category not found');
        return category;
    }
    async updateCategory(companyId, id, dto) {
        await this.findCategoryById(companyId, id);
        if (dto.name) {
            const exists = await this.prisma.category.findFirst({
                where: { name: dto.name, companyId, NOT: { id } },
            });
            if (exists)
                throw new common_1.BadRequestException('Category name already exists');
        }
        return this.prisma.category.update({
            where: { id },
            data: dto,
        });
    }
    async removeCategory(companyId, id) {
        await this.findCategoryById(companyId, id);
        const productsCount = await this.prisma.product.count({
            where: { categoryId: id },
        });
        if (productsCount > 0) {
            throw new common_1.BadRequestException('Cannot delete category containing active products');
        }
        return this.prisma.category.delete({ where: { id } });
    }
    async createProduct(companyId, dto, userId) {
        const category = await this.prisma.category.findUnique({
            where: { id: dto.categoryId },
        });
        if (!category || category.companyId !== companyId)
            throw new common_1.NotFoundException('Selected category does not exist');
        const skuExists = await this.prisma.product.findUnique({
            where: { SKU_companyId: { SKU: dto.SKU, companyId } },
        });
        if (skuExists)
            throw new common_1.BadRequestException('SKU must be unique');
        if (dto.barcode) {
            const barcodeExists = await this.prisma.product.findUnique({
                where: { barcode_companyId: { barcode: dto.barcode, companyId } },
            });
            if (barcodeExists)
                throw new common_1.BadRequestException('Barcode must be unique');
        }
        const productData = { ...dto, stock: 0, companyId };
        const product = await this.prisma.product.create({
            data: productData,
            include: { category: true },
        });
        return product;
    }
    async findAllProducts(companyId, query) {
        const page = Math.max(1, query.page || 1);
        const limit = Math.max(1, query.limit || 10);
        const skip = (page - 1) * limit;
        const where = { companyId };
        if (query.categoryId) {
            where.categoryId = Number(query.categoryId);
        }
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { SKU: { contains: query.search, mode: 'insensitive' } },
                { barcode: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        if (query.lowStockOnly || String(query.lowStockOnly) === 'true') {
            where.stock = {
                lte: this.prisma.product.fields.minStockAlert,
            };
        }
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: { category: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        const lowStockCount = await this.prisma.product.count({
            where: {
                companyId,
                stock: {
                    lte: 5,
                },
            },
        });
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lowStockCount,
        };
    }
    async findProductById(companyId, id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product || product.companyId !== companyId)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async findProductByBarcode(companyId, barcode) {
        const product = await this.prisma.product.findUnique({
            where: { barcode_companyId: { barcode, companyId } },
            include: { category: true },
        });
        if (!product)
            throw new common_1.NotFoundException(`Product with barcode ${barcode} not found`);
        return product;
    }
    async updateProduct(companyId, id, dto) {
        const current = await this.findProductById(companyId, id);
        if (dto.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: dto.categoryId },
            });
            if (!category || category.companyId !== companyId)
                throw new common_1.NotFoundException('Selected category does not exist');
        }
        if (dto.SKU && dto.SKU !== current.SKU) {
            const skuExists = await this.prisma.product.findUnique({
                where: { SKU_companyId: { SKU: dto.SKU, companyId } },
            });
            if (skuExists)
                throw new common_1.BadRequestException('SKU must be unique');
        }
        if (dto.barcode && dto.barcode !== current.barcode) {
            const barcodeExists = await this.prisma.product.findUnique({
                where: { barcode_companyId: { barcode: dto.barcode, companyId } },
            });
            if (barcodeExists)
                throw new common_1.BadRequestException('Barcode must be unique');
        }
        return this.prisma.product.update({
            where: { id },
            data: dto,
            include: { category: true },
        });
    }
    async removeProduct(companyId, id) {
        await this.findProductById(companyId, id);
        const salesCount = await this.prisma.saleItem.count({
            where: { productId: id },
        });
        if (salesCount > 0) {
            throw new common_1.BadRequestException('Cannot delete product because it has transaction history. Consider deactivating or updating stock to 0.');
        }
        return this.prisma.product.delete({ where: { id } });
    }
    async updateStockManually(companyId, id, quantity, type, reason, userId) {
        const product = await this.findProductById(companyId, id);
        let newStock = product.stock;
        if (type === 'STOCK_IN') {
            newStock += quantity;
        }
        else {
            if (product.stock < quantity) {
                throw new common_1.BadRequestException('Insufficient stock available');
            }
            newStock -= quantity;
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: { stock: newStock },
        });
        await this.prisma.inventoryTransaction.create({
            data: {
                productId: product.id,
                type: type,
                quantity: quantity,
                reason: reason || 'Manual Stock Adjustment',
                userId: userId,
                companyId,
            },
        });
        return updatedProduct;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map