import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { IncomeCategoriesService } from './income-categories.service';
import { CreateIncomeCategoryDto, UpdateIncomeCategoryDto } from './dto/income-categories.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Income Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('income-categories')
export class IncomeCategoriesController {
  constructor(private readonly categoriesService: IncomeCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new income category' })
  create(@Req() req: any, @Body() dto: CreateIncomeCategoryDto) {
    return this.categoriesService.create(req.user.companyId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all income categories' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.categoriesService.findAll(req.user.companyId, search, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific income category' })
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(req.user.companyId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update income category details' })
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIncomeCategoryDto) {
    return this.categoriesService.update(req.user.companyId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete income category' })
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(req.user.companyId, id);
  }
}
