import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/suppliers.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Suppliers CRM')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supplier' })
  create(@Req() req: any, @Body() dto: CreateSupplierDto) {
    return this.suppliersService.create(req.user, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List suppliers with filter and search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.suppliersService.findAll(req.user, search, page ? Number(page) : 1, limit ? Number(limit) : 100);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific supplier' })
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.findOne(req.user, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update supplier details' })
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSupplierDto) {
    return this.suppliersService.update(req.user, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete supplier' })
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.remove(req.user, id);
  }
}
