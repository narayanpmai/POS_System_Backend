import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ example: 'Himali Chauri Palan' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'supplier@himali.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '9841234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Solukhumbu, Nepal', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateSupplierDto {
  @ApiProperty({ example: 'Himali Chauri Palan', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'supplier@himali.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '9841234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Solukhumbu, Nepal', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
