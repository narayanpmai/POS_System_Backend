import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customers.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Customer Relationship Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new customer' })
  @ApiResponse({ status: 201, description: 'Customer successfully created' })
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Search and list customer registry with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string) {
    return this.customersService.findAll({ page, limit, search });
  }

  @Get('phone/:phone')
  @ApiOperation({ summary: 'Lookup customer by telephone for POS' })
  findByPhone(@Param('phone') phone: string) {
    return this.customersService.findByPhone(phone);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer profile and last purchases' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer details' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove customer (No purchase history)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(id);
  }
}
