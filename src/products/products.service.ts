import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // CATEGORIES BUSINESS LOGIC
  // ==========================================

  async createCategory(dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findFirst({ where: { name: dto.name },
    });
    if (exists) {
      throw new BadRequestException('Category name already exists');
    }
    return this.prisma.category.create({ data: dto });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' },
    });
  }

  async findCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    await this.findCategoryById(id);
    if (dto.name) {
      const exists = await this.prisma.category.findFirst({
        where: { name: dto.name, NOT: { id } },
      });
      if (exists) throw new BadRequestException('Category name already exists');
    }
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async removeCategory(id: number) {
    await this.findCategoryById(id);
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

  async createProduct(dto: CreateProductDto, userId: number) {
    // Check Category
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException('Selected category does not exist');

    // Check unique SKU
    const skuExists = await this.prisma.product.findFirst({ where: { SKU: dto.SKU },
    });
    if (skuExists) throw new BadRequestException('SKU must be unique');

    // Check unique barcode
    if (dto.barcode) {
      const barcodeExists = await this.prisma.product.findFirst({ where: { barcode: dto.barcode },
      });
      if (barcodeExists) throw new BadRequestException('Barcode must be unique');
    }

    // Force initial stock to 0 so that it only comes from Purchases
    const productData = { ...dto, stock: 0 };
    
    // Create product
    const product = await this.prisma.product.create({
      data: productData,
      include: { category: true },
    });

    return product;
  }

  async findAllProducts(query: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
    lowStockOnly?: boolean;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const skip = (page - 1) * limit;

    const where: any = {};

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

  async findProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findProductByBarcode(barcode: string) {
    const product = await this.prisma.product.findFirst({
      where: { barcode },
      include: { category: true },
    });
    if (!product) throw new NotFoundException(`Product with barcode ${barcode} not found`);
    return product;
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const current = await this.findProductById(id);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) throw new NotFoundException('Selected category does not exist');
    }

    if (dto.SKU && dto.SKU !== current.SKU) {
      const skuExists = await this.prisma.product.findFirst({ where: { SKU: dto.SKU },
      });
      if (skuExists) throw new BadRequestException('SKU must be unique');
    }

    if (dto.barcode && dto.barcode !== current.barcode) {
      const barcodeExists = await this.prisma.product.findFirst({ where: { barcode: dto.barcode },
      });
      if (barcodeExists) throw new BadRequestException('Barcode must be unique');
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async removeProduct(id: number) {
    await this.findProductById(id);

    // Verify if item has active sales references
    const salesCount = await this.prisma.saleItem.count({
      where: { productId: id },
    });
    if (salesCount > 0) {
      throw new BadRequestException('Cannot delete product because it has transaction history. Consider deactivating or updating stock to 0.');
    }

    return this.prisma.product.delete({ where: { id } });
  }

  async updateStockManually(id: number, quantity: number, type: 'STOCK_IN' | 'STOCK_OUT', reason: string, userId: number) {
    const product = await this.findProductById(id);
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
      },
    });

    return updatedProduct;
  }
}
