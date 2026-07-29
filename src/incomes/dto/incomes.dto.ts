import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({ example: 'EXP-1779897161' })
  @IsNotEmpty()
  @IsString()
  referenceNo: string;

  @ApiProperty({ example: 'Staff Salary' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ example: 12000 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Salary for Cashier Emma', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-05-27', required: false })
  @IsOptional()
  @IsString()
  date?: string;
}

export class UpdateIncomeDto {
  @ApiProperty({ example: 'EXP-1779897161', required: false })
  @IsOptional()
  @IsString()
  referenceNo?: string;

  @ApiProperty({ example: 'Staff Salary', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 12000, required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ example: 'Salary for Cashier Emma', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-05-27', required: false })
  @IsOptional()
  @IsString()
  date?: string;
}
