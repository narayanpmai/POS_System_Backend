import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SalesReturnsService } from './sales-returns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BsToAdPipe } from '../common/pipes/bs-to-ad.pipe';

@ApiTags('Sales Returns')
@ApiBearerAuth()
@Controller('sales-returns')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesReturnsController {
  constructor(private readonly salesReturnsService: SalesReturnsService) {}

  @Post()
  @ApiOperation({ summary: 'Process a sales return credit memo' })
  async create(@Req() req: any, @Body(BsToAdPipe) data: any) {
    return this.salesReturnsService.create(req.user.companyId, req.user.id, data);
  }

  @Get()
  @ApiOperation({ summary: 'List all sales return transactions' })
  async findAll(@Req() req: any) {
    return this.salesReturnsService.findAll(req.user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific sales return' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.salesReturnsService.findOne(req.user.companyId, +id);
  }
}
