import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto, UpdateIncomeDto } from './dto/incomes.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Store Incomes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  @ApiOperation({ summary: 'Log a new income' })
  create(@Body() dto: CreateIncomeDto) {
    return this.incomesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all logged incomes' })
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.incomesService.findAll(search, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific income' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.incomesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update logged income' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIncomeDto) {
    return this.incomesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete income' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.incomesService.remove(id);
  }
}
