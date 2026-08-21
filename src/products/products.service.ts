import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from './dto/products.dto';
import { buildPaginatedResponse } from '../common/interfaces/api-response.interface';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // CATEGORY BUSINESS LOGIC
  // ==========================================

  async createCategory(companyId: number, dto: CreateCategoryDto, imagePath?: string) {
    const exists = await this.prisma.category.findFirst({
      where: { name: dto.name, companyId },
    });
    if (exists) throw new BadRequestException('Category already exists in your company catalog');

    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({ where: { id: dto.parentId } });
      if (!parent || parent.companyId !== companyId) {
        throw new BadRequestException('Specified parent category does not exist');
      }
    }

    return this.prisma.category.create({
      data: { ...dto, companyId, ...(imagePath ? { image: imagePath } : {}) }
    });
  }

  async findAllCategories(
    companyId: number,
    query: { search?: string; page?: number; limit?: number } = {},
  ) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(500, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = { companyId };
    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    const [rawCategories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        include: {
          parent: { select: { id: true, name: true } },
          _count: { select: { products: true, children: true } },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.category.count({ where }),
    ]);

    // Auto-seed a default "General" category if company catalog has zero categories
    if (total === 0 && !query.search) {
      const defaultCategory = await this.prisma.category.create({
        data: { name: 'General', companyId },
      });
      return buildPaginatedResponse(
        [{ ...defaultCategory, fullPath: 'General', level: 0, _count: { products: 0, children: 0 } }],
        1,
        1,
        limit,
      );
    }

    // Fetch all company categories to compute fullPath accurately across parent hierarchy
    const allCompanyCats = await this.prisma.category.findMany({
      where: { companyId },
      select: { id: true, name: true, parentId: true },
    });
    const catMap = new Map<number, any>(allCompanyCats.map((c) => [c.id, c]));

    const getPathAndLevel = (catId: number): { fullPath: string; level: number } => {
      const cat = catMap.get(catId);
      if (!cat) return { fullPath: '', level: 0 };
      if (!cat.parentId || !catMap.has(cat.parentId)) {
        return { fullPath: cat.name, level: 0 };
      }
      const parentInfo = getPathAndLevel(cat.parentId);
      return {
        fullPath: `${parentInfo.fullPath} > ${cat.name}`,
        level: parentInfo.level + 1,
      };
    };

    const items = rawCategories.map((cat) => {
      const { fullPath, level } = getPathAndLevel(cat.id);
      return {
        ...cat,
        fullPath,
        level,
      };
    });

    return buildPaginatedResponse(items, total, page, limit);
  }

  async findCategoryTree(companyId: number) {
    const categoriesRes = await this.findAllCategories(companyId, { limit: 500 });
    const allCategories = categoriesRes.items;
    const catMap = new Map<number, any>();
    
    allCategories.forEach(cat => {
      catMap.set(cat.id, { ...cat, children: [] });
    });

    const rootTree: any[] = [];
    allCategories.forEach(cat => {
      const node = catMap.get(cat.id);
      if (cat.parentId && catMap.has(cat.parentId)) {
        catMap.get(cat.parentId).children.push(node);
      } else {
        rootTree.push(node);
      }
    });

    // Recursively sum total products for parent categories
    const calcTotalProducts = (node: any): number => {
      let count = node._count?.products || 0;
      for (const child of node.children) {
        count += calcTotalProducts(child);
      }
      node._count = { ...node._count, products: count };
      return count;
    };

    rootTree.forEach(root => calcTotalProducts(root));

    return rootTree;
  }

  async findCategoryById(companyId: number, id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: true
      },
    });
    if (!category || category.companyId !== companyId) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(companyId: number, id: number, dto: UpdateCategoryDto, imagePath?: string) {
    await this.findCategoryById(companyId, id);

    if (dto.parentId !== undefined && dto.parentId !== null) {
      if (dto.parentId === id) {
        throw new BadRequestException('A category cannot be its own parent');
      }

      // Check circular reference
      let currentParentId: number | null = dto.parentId;
      while (currentParentId) {
        if (currentParentId === id) {
          throw new BadRequestException('Circular parent relationship detected');
        }
        const parentCat = await this.prisma.category.findUnique({ where: { id: currentParentId } });
        currentParentId = parentCat ? parentCat.parentId : null;
      }
    }

    if (dto.name) {
      const exists = await this.prisma.category.findFirst({
        where: { name: dto.name, companyId, NOT: { id } },
      });
      if (exists) throw new BadRequestException('Category name already exists');
    }
    return this.prisma.category.update({
      where: { id },
      data: { ...dto, ...(imagePath ? { image: imagePath } : {}) },
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

    // Check if child subcategories exist
    const childrenCount = await this.prisma.category.count({
      where: { parentId: id },
    });
    if (childrenCount > 0) {
      throw new BadRequestException('Cannot delete category that contains subcategories. Delete or reassign subcategories first.');
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

    // Auto-generate SKU if not provided or empty
    let sku = dto.SKU?.trim();
    if (!sku) {
      const count = await this.prisma.product.count({ where: { companyId } });
      const catPrefix = category?.name ? category.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'PRD') : 'PRD';
      sku = `KG-${catPrefix || 'PRD'}-${String(count + 10001).padStart(5, '0')}`;
    }

    // Check unique SKU
    const skuExists = await this.prisma.product.findUnique({
      where: { SKU_companyId: { SKU: sku, companyId } },
    });
    if (skuExists) throw new BadRequestException(`SKU "${sku}" already exists`);

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
        SKU: sku,
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
    query: { page?: number; limit?: number; search?: string; categoryId?: number; lowStockOnly?: boolean; inStockOnly?: boolean },
  ) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(2000, Math.max(1, Number(query.limit) || 20));
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
      const catId = Number(query.categoryId);
      // Collect target category + all its subcategory IDs recursively
      const allCats = await this.prisma.category.findMany({
        where: { companyId },
        select: { id: true, parentId: true }
      });
      const getSubCatIds = (targetId: number): number[] => {
        const children = allCats.filter(c => c.parentId === targetId);
        let ids = [targetId];
        for (const child of children) {
          ids = ids.concat(getSubCatIds(child.id));
        }
        return ids;
      };
      const categoryIds = getSubCatIds(catId);
      where.categoryId = { in: categoryIds };
    }

    if (query.lowStockOnly && query.inStockOnly) {
      where.stock = { gt: 0, lte: this.prisma.product.fields.minStockAlert };
    } else if (query.lowStockOnly) {
      where.stock = { lte: this.prisma.product.fields.minStockAlert };
    } else if (query.inStockOnly) {
      where.stock = { gt: 0 };
    }

    const [items, total, globalConversions] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true, unitConversions: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
      this.prisma.unitConversion.findMany({
        where: { companyId, productId: null },
      }),
    ]);

    // Attach global unit conversions matching product.unit if no product-specific conversion exists
    const enrichedItems = items.map((product) => {
      const prodUnit = (product.unit || 'pcs').trim().toLowerCase();
      const matchingGlobals = globalConversions.filter(
        (g) => g.baseUnit.trim().toLowerCase() === prodUnit,
      );

      // Combine product-specific conversions with matching global conversions (avoiding duplicates)
      const existingSecondaryUnits = new Set(
        (product.unitConversions || []).map((uc) => uc.secondaryUnit.trim().toLowerCase()),
      );

      const mergedConversions = [...(product.unitConversions || [])];
      for (const globalUc of matchingGlobals) {
        if (!existingSecondaryUnits.has(globalUc.secondaryUnit.trim().toLowerCase())) {
          mergedConversions.push(globalUc);
        }
      }

      return {
        ...product,
        unitConversions: mergedConversions,
      };
    });

    return buildPaginatedResponse(enrichedItems, total, page, limit);
  }

  async findProductById(companyId: number, id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, unitConversions: true },
    });
    if (!product || product.companyId !== companyId) {
      throw new NotFoundException('Product not found');
    }

    const prodUnit = (product.unit || 'pcs').trim().toLowerCase();
    const globalConversions = await this.prisma.unitConversion.findMany({
      where: { companyId, productId: null, baseUnit: { equals: prodUnit, mode: 'insensitive' } },
    });

    const existingSecondaryUnits = new Set(
      (product.unitConversions || []).map((uc) => uc.secondaryUnit.trim().toLowerCase()),
    );

    const mergedConversions = [...(product.unitConversions || [])];
    for (const globalUc of globalConversions) {
      if (!existingSecondaryUnits.has(globalUc.secondaryUnit.trim().toLowerCase())) {
        mergedConversions.push(globalUc);
      }
    }

    return { ...product, unitConversions: mergedConversions };
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
