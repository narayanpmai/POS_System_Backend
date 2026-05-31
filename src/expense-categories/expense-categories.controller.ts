import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ExpenseCategoriesService } from './expense-categories.service';
import { CreateExpenseCategoryDto, UpdateExpenseCategoryDto } from './dto/expense-categories.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Expense Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('expense-categories')
export class ExpenseCategoriesController {
  constructor(private readonly categoriesService: ExpenseCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense category' })
  create(@Body() dto: CreateExpenseCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expense categories' })
  findAll(@Query('search') search?: string) {
    return this.categoriesService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific expense category' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update expense category details' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExpenseCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense category' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
