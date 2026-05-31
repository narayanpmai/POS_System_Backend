import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'Samsung' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'ACTIVE', required: false, enum: ['ACTIVE', 'INACTIVE'] })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateBrandDto {
  @ApiProperty({ example: 'Samsung', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'ACTIVE', required: false, enum: ['ACTIVE', 'INACTIVE'] })
  @IsOptional()
  @IsString()
  status?: string;
}
