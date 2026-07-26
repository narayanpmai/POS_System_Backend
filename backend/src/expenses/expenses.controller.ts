import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expenses.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Store Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Log a new expense' })
  create(@Req() req: any, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(req.user.companyId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all logged expenses' })
  findAll(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.expensesService.findAll(req.user.companyId, search, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific expense' })
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.expensesService.findOne(req.user.companyId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update logged expense' })
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExpenseDto) {
    return this.expensesService.update(req.user.companyId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense' })
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.expensesService.remove(req.user.companyId, id);
  }
}
