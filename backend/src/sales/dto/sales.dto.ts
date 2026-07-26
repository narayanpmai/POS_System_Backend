import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class CreateSaleItemDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity purchased' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateSaleDto {
  @ApiProperty({ example: 1, description: 'Customer ID (Optional for Walk-In)', required: false })
  @IsNumber()
  @IsOptional()
  customerId?: number;

  @ApiProperty({ example: 'CASH', description: 'CASH, CARD, or QR' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({ example: 5.0, description: 'Discount applied', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @ApiProperty({ type: [CreateSaleItemDto], description: 'List of products in cart' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];
}
