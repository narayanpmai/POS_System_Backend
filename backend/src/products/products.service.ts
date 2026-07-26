import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // CATEGORIES BUSINESS LOGIC
  // ==========================================

  async createCategory(companyId: number, dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findUnique({
      where: { name_companyId: { name: dto.name, companyId } },
    });
    if (exists) {
      throw new BadRequestException('Category name already exists');
    }
    return this.prisma.category.create({ data: { ...dto, companyId } });
  }

  async findAllCategories(companyId: number) {
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
    // Check Category
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category || category.companyId !== companyId) throw new NotFoundException('Selected category does not exist');

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
    const productData = { ...dto, stock: 0, companyId };
    
    // Create product
    const product = await this.prisma.product.create({
      data: productData,
      include: { category: true },
    });

    return product;
  }

  async findAllProducts(companyId: number, query: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
    lowStockOnly?: boolean;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const skip = (page - 1) * limit;

    const where: any = { companyId };

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

    // Handle low stock filter
    if (query.lowStockOnly || String(query.lowStockOnly) === 'true') {
      where.stock = {
        lte: this.prisma.product.fields.minStockAlert, // Less than or equal to minStockAlert
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

    // Low stock warnings summary count
    const lowStockCount = await this.prisma.product.count({
      where: {
        companyId,
        stock: {
          lte: 5, // Default warning threshold
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

  async findProductById(companyId: number, id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product || product.companyId !== companyId) throw new NotFoundException('Product not found');
    return product;
  }

  async findProductByBarcode(companyId: number, barcode: string) {
    const product = await this.prisma.product.findUnique({
      where: { barcode_companyId: { barcode, companyId } },
      include: { category: true },
    });
    if (!product) throw new NotFoundException(`Product with barcode ${barcode} not found`);
    return product;
  }

  async updateProduct(companyId: number, id: number, dto: UpdateProductDto) {
    const current = await this.findProductById(companyId, id);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category || category.companyId !== companyId) throw new NotFoundException('Selected category does not exist');
    }

    if (dto.SKU && dto.SKU !== current.SKU) {
      const skuExists = await this.prisma.product.findUnique({
        where: { SKU_companyId: { SKU: dto.SKU, companyId } },
      });
      if (skuExists) throw new BadRequestException('SKU must be unique');
    }

    if (dto.barcode && dto.barcode !== current.barcode) {
      const barcodeExists = await this.prisma.product.findUnique({
        where: { barcode_companyId: { barcode: dto.barcode, companyId } },
      });
      if (barcodeExists) throw new BadRequestException('Barcode must be unique');
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async removeProduct(companyId: number, id: number) {
    await this.findProductById(companyId, id);

    // Verify if item has active sales references
    const salesCount = await this.prisma.saleItem.count({
      where: { productId: id },
    });
    if (salesCount > 0) {
      throw new BadRequestException('Cannot delete product because it has transaction history. Consider deactivating or updating stock to 0.');
    }

    return this.prisma.product.delete({ where: { id } });
  }

  async updateStockManually(companyId: number, id: number, quantity: number, type: 'STOCK_IN' | 'STOCK_OUT', reason: string, userId: number) {
    const product = await this.findProductById(companyId, id);
    let newStock = product.stock;

    if (type === 'STOCK_IN') {
      newStock += quantity;
    } else {
      if (product.stock < quantity) {
        throw new BadRequestException('Insufficient stock available');
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
}
