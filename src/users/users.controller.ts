import { Controller, Get, Post, Put, Patch, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
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
  findAll(@Req() req: any) {
    return this.usersService.findAll(req.user);
  }

  @Get('roles')
  @Roles('Admin')
  getRoles(@Req() req: any) {
    return this.usersService.getRoles(req.user);
  }

  @Post()
  @Roles('Admin')
  create(@Req() req: any, @Body() body: any) {
    return this.usersService.create(req.user, body);
  }

  @Put(':id')
  @Roles('Admin')
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.usersService.update(req.user, id, body);
  }

  @Patch(':id/reset-password')
  @Roles('Admin')
  resetPassword(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.usersService.resetPassword(req.user, id, body);
  }
}
