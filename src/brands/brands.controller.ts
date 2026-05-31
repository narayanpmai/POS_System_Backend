import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/brands.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Brands Catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new brand' })
  create(@Body() dto: CreateBrandDto) {
    return this.brandsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  findAll(@Query('search') search?: string) {
    return this.brandsService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific brand' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update brand details' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBrandDto) {
    return this.brandsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete brand' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.remove(id);
  }
}
