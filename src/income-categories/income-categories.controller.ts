import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { IncomeCategoriesService } from './income-categories.service';
import { CreateIncomeCategoryDto, UpdateIncomeCategoryDto } from './dto/income-categories.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Income Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('income-categories')
export class IncomeCategoriesController {
  constructor(private readonly categoriesService: IncomeCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new income category' })
  create(@Body() dto: CreateIncomeCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all income categories' })
  findAll(@Query('search') search?: string) {
    return this.categoriesService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific income category' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update income category details' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIncomeCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete income category' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
