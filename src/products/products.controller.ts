import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, ParseIntPipe, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { File as MulterFile } from 'multer';
import { extname, join } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from './dto/products.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';

const categoryImageStorage = diskStorage({
  destination: join(process.cwd(), 'uploads', 'categories'),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `cat-${unique}${extname(file.originalname)}`);
  },
});

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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: categoryImageStorage }))
  createCategory(
    @Req() req: any,
    @Body() dto: CreateCategoryDto,
    @UploadedFile() imageFile?: MulterFile,
  ) {
    const imagePath = imageFile ? `uploads/categories/${imageFile.filename}` : undefined;
    return this.productsService.createCategory(req.user.companyId, dto, imagePath);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category details' })
  findCategoryById(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.productsService.findCategoryById(req.user.companyId, id);
  }

  @Put(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update category' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: categoryImageStorage }))
  updateCategory(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
    @UploadedFile() imageFile?: MulterFile,
  ) {
    const imagePath = imageFile ? `uploads/categories/${imageFile.filename}` : undefined;
    return this.productsService.updateCategory(req.user.companyId, id, dto, imagePath);
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: categoryImageStorage }))
  createCategory(
    @Req() req: any,
    @Body() dto: CreateCategoryDto,
    @UploadedFile() imageFile?: MulterFile,
  ) {
    const imagePath = imageFile ? `uploads/categories/${imageFile.filename}` : undefined;
    return this.productsService.createCategory(req.user.companyId, dto, imagePath);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all product categories' })
  findAllCategories(@Req() req: any) {
    return this.productsService.findAllCategories(req.user.companyId);
  }

  @Get('categories/tree')
  @ApiOperation({ summary: 'Get nested category hierarchy tree' })
  findCategoryTree(@Req() req: any) {
    return this.productsService.findCategoryTree(req.user.companyId);
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category details' })
  findCategoryById(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.productsService.findCategoryById(req.user.companyId, id);
  }

  @Put('categories/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update category (Admin Only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: categoryImageStorage }))
  updateCategory(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
    @UploadedFile() imageFile?: MulterFile,
  ) {
    const imagePath = imageFile ? `uploads/categories/${imageFile.filename}` : undefined;
    return this.productsService.updateCategory(req.user.companyId, id, dto, imagePath);
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
