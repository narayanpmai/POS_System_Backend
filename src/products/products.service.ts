import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // CATEGORY BUSINESS LOGIC
  // ==========================================

  async createCategory(companyId: number, dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findFirst({
      where: { name: dto.name, companyId },
    });
    if (exists) throw new BadRequestException('Category already exists in your company catalog');

    return this.prisma.category.create({ data: { ...dto, companyId } });
  }

  async findAllCategories(companyId: number) {
    let categories = await this.prisma.category.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' },
    });

    // Auto-seed a default "General" category if company catalog has zero categories
    if (categories.length === 0) {
      const defaultCategory = await this.prisma.category.create({
        data: { name: 'General', companyId }
      });
      return [{ ...defaultCategory, _count: { products: 0 } }];
    }

    return categories;
  }

  async findCategoryById(companyId: number, id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category || category.companyId !== companyId) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(companyId: number, id: number, dto: UpdateCategoryDto) {
    await this.findCategoryById(companyId, id);
    if (dto.name) {
      const exists = await this.prisma.category.findFirst({
        where: { name: dto.name, companyId, NOT: { id } },
      });
      if (exists) throw new BadRequestException('Category name already exists');
    }
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async removeCategory(companyId: number, id: number) {
    await this.findCategoryById(companyId, id);
    // Check if products exist in category
    const productsCount = await this.prisma.product.count({
      where: { categoryId: id },
    });
    if (productsCount > 0) {
      throw new BadRequestException('Cannot delete category containing active products');
    }
    return this.prisma.category.delete({ where: { id } });
  }

  // ==========================================
  // PRODUCTS BUSINESS LOGIC
  // ==========================================

  async createProduct(companyId: number, dto: CreateProductDto, userId: number) {
    // Validate or auto-assign category
    let category = await this.prisma.category.findFirst({
      where: { id: dto.categoryId }
    });

    if (!category || category.companyId !== companyId) {
      category = await this.prisma.category.findFirst({ where: { companyId } });
      if (!category) {
        category = await this.prisma.category.create({
          data: { name: 'General', companyId }
        });
      }
      dto.categoryId = category.id;
    }

    // Check unique SKU
    const skuExists = await this.prisma.product.findUnique({
      where: { SKU_companyId: { SKU: dto.SKU, companyId } },
    });
    if (skuExists) throw new BadRequestException('SKU must be unique');

    // Check unique barcode
    if (dto.barcode) {
      const barcodeExists = await this.prisma.product.findUnique({
        where: { barcode_companyId: { barcode: dto.barcode, companyId } },
      });
      if (barcodeExists) throw new BadRequestException('Barcode must be unique');
    }

    // Force initial stock to 0 so that it only comes from Purchases
    return this.prisma.product.create({
      data: {
        name: dto.name,
        SKU: dto.SKU,
        barcode: dto.barcode || undefined,
        price: dto.price,
        cost: dto.cost,
        minStockAlert: dto.minStockAlert || 5,
        taxRate: dto.taxRate || 0,
        stock: 0,
        categoryId: dto.categoryId,
        companyId,
      },
      include: { category: true }
    });
  }

  async findAllProducts(
    companyId: number,
    query: { page?: number; limit?: number; search?: string; categoryId?: number; lowStockOnly?: boolean },
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = { companyId };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { SKU: { contains: query.search, mode: 'insensitive' } },
        { barcode: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.categoryId) {
      where.categoryId = Number(query.categoryId);
    }

    if (query.lowStockOnly) {
      where.stock = { lte: this.prisma.product.fields.minStockAlert };
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true, unitConversions: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findProductById(companyId: number, id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, unitConversions: true },
    });
    if (!product || product.companyId !== companyId) throw new NotFoundException('Product not found');
    return product;
  }

  async findProductByBarcode(companyId: number, barcode: string) {
    const product = await this.prisma.product.findUnique({
      where: { barcode_companyId: { barcode, companyId } },
      include: { category: true, unitConversions: true },
    });
    if (!product) throw new NotFoundException(`Product with barcode "${barcode}" not found`);
    return product;
  }

  async updateProduct(companyId: number, id: number, dto: UpdateProductDto) {
    await this.findProductById(companyId, id);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
      if (!category || category.companyId !== companyId) throw new NotFoundException('Selected category does not exist');
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true, unitConversions: true },
    });
  }

  async removeProduct(companyId: number, id: number) {
    await this.findProductById(companyId, id);
    return this.prisma.product.delete({ where: { id } });
  }

  async updateStockManually(companyId: number, id: number, quantity: number, type: 'STOCK_IN' | 'STOCK_OUT', reason: string, userId: number) {
    const product = await this.findProductById(companyId, id);
    let newStock = product.stock;

    if (type === 'STOCK_IN') {
      newStock += quantity;
    } else {
      if (product.stock < quantity) throw new BadRequestException('Insufficient stock for STOCK_OUT');
      newStock -= quantity;
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: { stock: newStock },
      });

      await tx.inventoryTransaction.create({
        data: {
          productId: id,
          type,
          quantity,
          reason: reason || 'MANUAL_ADJUSTMENT',
          userId,
          companyId,
        },
      });

      return updatedProduct;
    });
  }
}
