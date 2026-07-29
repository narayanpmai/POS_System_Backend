import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFiscalYearDto {
  @ApiProperty({ example: '2080/081', description: 'Fiscal Year Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2023-07-17', description: 'Start Date (AD)' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2024-07-15', description: 'End Date (AD)' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateFiscalYearDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
