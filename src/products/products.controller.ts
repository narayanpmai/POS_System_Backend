import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, ParseIntPipe, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from './dto/products.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Products & Catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ==========================================
  // CATEGORY ENDPOINTS
  // ==========================================

  @Post('categories')
  @Roles('Admin')
  @ApiOperation({ summary: 'Create new product category (Admin Only)' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.productsService.createCategory(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all product categories' })
  findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category details' })
  findCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findCategoryById(id);
  }

  @Put('categories/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update category (Admin Only)' })
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.productsService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete category (Admin Only)' })
  removeCategory(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.removeCategory(id);
  }

  // ==========================================
  // PRODUCT ENDPOINTS
  // ==========================================

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create new product (Admin Only)' })
  createProduct(@Body() dto: CreateProductDto, @Req() req: any) {
    const userId = req.user.id;
    return this.productsService.createProduct(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Search and list products with filters and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'lowStockOnly', required: false, type: Boolean })
  findAllProducts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: number,
    @Query('lowStockOnly') lowStockOnly?: boolean,
  ) {
    return this.productsService.findAllProducts({ page, limit, search, categoryId, lowStockOnly });
  }

  @Get('barcode/:barcode')
  @ApiOperation({ summary: 'Find product by barcode scanner value' })
  findProductByBarcode(@Param('barcode') barcode: string) {
    return this.productsService.findProductByBarcode(barcode);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product details' })
  findProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findProductById(id);
  }

  @Put(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update product properties (Admin Only)' })
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete product (Admin Only)' })
  removeProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.removeProduct(id);
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
    return this.productsService.updateStockManually(id, quantity, type, reason, userId);
  }
}
