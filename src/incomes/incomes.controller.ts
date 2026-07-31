import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
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
  create(@Req() req: any, @Body() dto: CreateIncomeDto) {
    return this.incomesService.create(req.user.companyId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all logged incomes' })
  findAll(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.incomesService.findAll(req.user.companyId, search, category, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific income' })
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.incomesService.findOne(req.user.companyId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update logged income' })
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIncomeDto) {
    return this.incomesService.update(req.user.companyId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete income' })
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.incomesService.remove(req.user.companyId, id);
  }
}
