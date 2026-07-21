import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // CATEGORIES BUSINESS LOGIC
  // ==========================================

  async createCategory(user: any, dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findUnique({
      where: { name_companyId: { name: dto.name, companyId: user.companyId } },
    });
    if (exists) {
      throw new BadRequestException('Category name already exists');
    }
    return this.prisma.category.create({ data: { ...dto, companyId: user.companyId } });
  }

  async findAllCategories(user: any) {
    return this.prisma.category.findMany({
      where: { companyId: user.companyId },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' },
    });
  }

  async findCategoryById(user: any, id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category || category.companyId !== user.companyId) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(user: any, id: number, dto: UpdateCategoryDto) {
    await this.findCategoryById(user, id);
    if (dto.name) {
      const exists = await this.prisma.category.findFirst({
        where: { name: dto.name, NOT: { id }, companyId: user.companyId },
      });
      if (exists) throw new BadRequestException('Category name already exists');
    }
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async removeCategory(user: any, id: number) {
    await this.findCategoryById(user, id);
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

  async createProduct(dto: CreateProductDto, user: any) {
    // Check Category
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category || category.companyId !== user.companyId) throw new NotFoundException('Selected category does not exist');

    // Check unique SKU
    const skuExists = await this.prisma.product.findUnique({
      where: { SKU_companyId: { SKU: dto.SKU, companyId: user.companyId } },
    });
    if (skuExists) throw new BadRequestException('SKU must be unique');

    // Check unique barcode
    if (dto.barcode) {
      const barcodeExists = await this.prisma.product.findUnique({
        where: { barcode_companyId: { barcode: dto.barcode, companyId: user.companyId } },
      });
      if (barcodeExists) throw new BadRequestException('Barcode must be unique');
    }

    // Force initial stock to 0 so that it only comes from Purchases
    const productData = { ...dto, stock: 0, companyId: user.companyId };
    
    // Create product
    const product = await this.prisma.product.create({
      data: productData,
      include: { category: true },
    });

    return product;
  }

  async findAllProducts(user: any, query: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
    lowStockOnly?: boolean;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const skip = (page - 1) * limit;

    const where: any = { companyId: user.companyId };

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
        companyId: user.companyId,
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

  async findProductById(user: any, id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product || product.companyId !== user.companyId) throw new NotFoundException('Product not found');
    return product;
  }

  async findProductByBarcode(user: any, barcode: string) {
    const product = await this.prisma.product.findUnique({
      where: { barcode_companyId: { barcode, companyId: user.companyId } },
      include: { category: true },
    });
    if (!product || product.companyId !== user.companyId) throw new NotFoundException(`Product with barcode ${barcode} not found`);
    return product;
  }

  async updateProduct(user: any, id: number, dto: UpdateProductDto) {
    const current = await this.findProductById(user, id);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category || category.companyId !== user.companyId) throw new NotFoundException('Selected category does not exist');
    }

    if (dto.SKU && dto.SKU !== current.SKU) {
      const skuExists = await this.prisma.product.findUnique({
        where: { SKU_companyId: { SKU: dto.SKU, companyId: user.companyId } },
      });
      if (skuExists) throw new BadRequestException('SKU must be unique');
    }

    if (dto.barcode && dto.barcode !== current.barcode) {
      const barcodeExists = await this.prisma.product.findUnique({
        where: { barcode_companyId: { barcode: dto.barcode, companyId: user.companyId } },
      });
      if (barcodeExists) throw new BadRequestException('Barcode must be unique');
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async removeProduct(user: any, id: number) {
    await this.findProductById(user, id);

    // Verify if item has active sales references
    const salesCount = await this.prisma.saleItem.count({
      where: { productId: id },
    });
    if (salesCount > 0) {
      throw new BadRequestException('Cannot delete product because it has transaction history. Consider deactivating or updating stock to 0.');
    }

    return this.prisma.product.delete({ where: { id } });
  }

  async updateStockManually(id: number, quantity: number, type: 'STOCK_IN' | 'STOCK_OUT', reason: string, user: any) {
    const product = await this.findProductById(user, id);
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
        userId: user.id,
        companyId: user.companyId,
      },
    });

    return updatedProduct;
  }
}
