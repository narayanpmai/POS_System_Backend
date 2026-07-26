import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateExpenseCategoryDto {
  @ApiProperty({ example: 'Staff Salary' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Expenses incurred from employee wages', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateExpenseCategoryDto {
  @ApiProperty({ example: 'Staff Salary', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Expenses incurred from employee wages', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
