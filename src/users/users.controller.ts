import { Controller, Get, Post, Put, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('Admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('roles')
  @Roles('Admin')
  getRoles() {
    return this.usersService.getRoles();
  }

  @Post()
  @Roles('Admin')
  create(@Body() body: any) {
    return this.usersService.create(body);
  }

  @Put(':id')
  @Roles('Admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.usersService.update(id, body);
  }

  @Patch(':id/reset-password')
  @Roles('Admin')
  resetPassword(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.usersService.resetPassword(id, body);
  }
}
