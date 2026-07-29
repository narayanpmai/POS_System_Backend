import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
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
  create(@Req() req: any, @Body() dto: CreateBrandDto) {
    return this.brandsService.create(req.user.companyId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  findAll(@Req() req: any, @Query('search') search?: string) {
    return this.brandsService.findAll(req.user.companyId, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific brand' })
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.brandsService.findOne(req.user.companyId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update brand details' })
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBrandDto) {
    return this.brandsService.update(req.user.companyId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete brand' })
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.brandsService.remove(req.user.companyId, id);
  }
}
