import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateIncomeCategoryDto {
  @ApiProperty({ example: 'Staff Salary' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Incomes incurred from employee wages', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateIncomeCategoryDto {
  @ApiProperty({ example: 'Staff Salary', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Incomes incurred from employee wages', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
