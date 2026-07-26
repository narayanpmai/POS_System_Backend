import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateSettingsDto {
  @ApiProperty({ example: 'Antigravity Hyper POS', required: false })
  @IsString()
  @IsOptional()
  storeName?: string;

  @ApiProperty({ example: '100 Galaxy Way, Suite 2026', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '+1 (555) 767-2026', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'sales@antigravitypos.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'VAT-US-202605', required: false })
  @IsString()
  @IsOptional()
  taxNumber?: string;

  @ApiProperty({ example: '$', required: false })
  @IsString()
  @IsOptional()
  currencySymbol?: string;

  @ApiProperty({ example: 'Welcome to Antigravity SmartPOS!', required: false })
  @IsString()
  @IsOptional()
  receiptHeader?: string;

  @ApiProperty({ example: 'Thank you! See you again soon!', required: false })
  @IsString()
  @IsOptional()
  receiptFooter?: string;

  @ApiProperty({ example: 'PTRM', required: false })
  @IsString()
  @IsOptional()
  invoicePrefix?: string;

  @ApiProperty({ example: 12.0, required: false })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  taxRateDefault?: number;
}
