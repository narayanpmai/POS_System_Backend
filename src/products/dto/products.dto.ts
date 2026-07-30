import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Product Category Name' })
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  name: string;

  @ApiProperty({ example: 'Devices and gadgets', description: 'Category description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, description: 'Parent Category Database ID', required: false })
  @Transform(({ value }) => {
    if (value === '' || value === 'null' || value === null || value === undefined) return null;
    const n = parseInt(value, 10);
    return isNaN(n) ? null : n;
  })
  @IsNumber()
  @IsOptional()
  parentId?: number | null;

  // image is handled as a multipart/form-data upload, not a DTO field
}

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Electronics', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, description: 'Parent Category Database ID', required: false })
  @Transform(({ value }) => {
    if (value === '' || value === 'null' || value === null || value === undefined) return null;
    const n = parseInt(value, 10);
    return isNaN(n) ? null : n;
  })
  @IsNumber()
  @IsOptional()
  parentId?: number | null;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Smart Display 27"', description: 'Product name' })
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @ApiProperty({ example: 'ELE-DISP-27', description: 'SKU Code' })
  @IsString()
  @IsNotEmpty({ message: 'SKU is required' })
  SKU: string;

  @ApiProperty({ example: '880901234501', description: 'Barcode value', required: false })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ example: 'High resolution screen', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 299.99, description: 'Selling price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 180.00, description: 'Cost price / purchase price' })
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiProperty({ example: 15, description: 'Initial stock' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 5, description: 'Stock threshold for low inventory alert' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minStockAlert?: number;

  @ApiProperty({ example: 1, description: 'Category Database ID' })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ example: 12.0, description: 'Tax percentage (0-100)' })
  @IsNumber()
  @IsOptional()
  taxRate?: number;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', required: false })
  @IsString()
  @IsOptional()
  image?: string;
  @ApiProperty({ example: 1, description: 'Brand Database ID', required: false })
  @IsNumber()
  @IsOptional()
  brandId?: number;

  @ApiProperty({ example: 'pcs', description: 'Measurement Unit', required: false })
  @IsString()
  @IsOptional()
  unit?: string;
}

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  SKU?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  cost?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minStockAlert?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  taxRate?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  brandId?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  unit?: string;
}
