import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John Doe', description: 'Customer Full Name' })
  @IsString()
  @IsNotEmpty({ message: 'Customer name is required' })
  name: string;

  @ApiProperty({ example: 'john@gmail.com', description: 'Customer email', required: false })
  @IsEmail({}, { message: 'Please enter a valid email' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+1 555-0155', description: 'Customer telephone', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '50 Elm St, NY', description: 'Physical address', required: false })
  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateCustomerDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;
}
