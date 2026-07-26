import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
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
  create(@Req() req: any, @Body() dto: CreateExpenseCategoryDto) {
    return this.categoriesService.create(req.user.companyId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expense categories' })
  findAll(@Req() req: any, @Query('search') search?: string) {
    return this.categoriesService.findAll(req.user.companyId, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific expense category' })
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(req.user.companyId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update expense category details' })
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExpenseCategoryDto) {
    return this.categoriesService.update(req.user.companyId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense category' })
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(req.user.companyId, id);
  }
}
