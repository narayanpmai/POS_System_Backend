import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUnitConversionDto {
  @ApiProperty({ example: 'KG' })
  @IsString()
  baseUnit: string;

  @ApiProperty({ example: 'Gram' })
  @IsString()
  secondaryUnit: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  conversionFactor: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  productId?: number;
}
