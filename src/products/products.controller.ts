import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, ParseIntPipe, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from './dto/products.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all product categories' })
  findAllCategories(@Req() req: any) {
    return this.productsService.findAllCategories(req.user.companyId);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get nested category hierarchy tree' })
  findCategoryTree(@Req() req: any) {
    return this.productsService.findCategoryTree(req.user.companyId);
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create new product category' })
  createCategory(@Req() req: any, @Body() dto: CreateCategoryDto) {
    return this.productsService.createCategory(req.user.companyId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category details' })
  findCategoryById(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.productsService.findCategoryById(req.user.companyId, id);
  }

  @Put(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update category' })
  updateCategory(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.productsService.updateCategory(req.user.companyId, id, dto);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete category' })
  removeCategory(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.productsService.removeCategory(req.user.companyId, id);
  }
}

@ApiTags('Products & Catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ==========================================
  // CATEGORY ENDPOINTS (Alias under /products/categories)
  // ==========================================

  @Post('categories')
  @Roles('Admin')
  @ApiOperation({ summary: 'Create new product category (Admin Only)' })
  createCategory(@Req() req: any, @Body() dto: CreateCategoryDto) {
    return this.productsService.createCategory(req.user.companyId, dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all product categories' })
  findAllCategories(@Req() req: any) {
    return this.productsService.findAllCategories(req.user.companyId);
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category details' })
  findCategoryById(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.productsService.findCategoryById(req.user.companyId, id);
  }

  @Put('categories/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update category (Admin Only)' })
  updateCategory(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.productsService.updateCategory(req.user.companyId, id, dto);
  }

  @Delete('categories/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete category (Admin Only)' })
  removeCategory(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.productsService.removeCategory(req.user.companyId, id);
  }

  // ==========================================
  // PRODUCT ENDPOINTS
  // ==========================================

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create new product (Admin Only)' })
  createProduct(@Body() dto: CreateProductDto, @Req() req: any) {
    const userId = req.user.id;
    return this.productsService.createProduct(req.user.companyId, dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Search and list products with filters and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'lowStockOnly', required: false, type: Boolean })
  findAllProducts(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: number,
    @Query('lowStockOnly') lowStockOnly?: boolean,
  ) {
    return this.productsService.findAllProducts(req.user.companyId, { page, limit, search, categoryId, lowStockOnly });
  }

  @Get('barcode/:barcode')
  @ApiOperation({ summary: 'Find product by barcode scanner value' })
  findProductByBarcode(@Req() req: any, @Param('barcode') barcode: string) {
    return this.productsService.findProductByBarcode(req.user.companyId, barcode);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product details' })
  findProductById(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.productsService.findProductById(req.user.companyId, id);
  }

  @Put(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update product properties (Admin Only)' })
  updateProduct(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(req.user.companyId, id, dto);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete product (Admin Only)' })
  removeProduct(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.productsService.removeProduct(req.user.companyId, id);
  }

  @Patch(':id/stock')
  @Roles('Admin')
  @ApiOperation({ summary: 'Manual stock adjust - stock in / stock out (Admin Only)' })
  updateStockManually(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity', ParseIntPipe) quantity: number,
    @Body('type') type: 'STOCK_IN' | 'STOCK_OUT',
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.productsService.updateStockManually(req.user.companyId, id, quantity, type, reason, userId);
  }
}
