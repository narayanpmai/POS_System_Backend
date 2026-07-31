import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Users Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('Admin')
  @ApiOperation({ summary: 'Get all users in company with pagination & search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.findAll(req.user, { search, page, limit });
  }

  @Get('roles')
  @Roles('Admin')
  @ApiOperation({ summary: 'Get list of assignable system roles' })
  getRoles(@Req() req: any) {
    return this.usersService.getRoles(req.user);
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create a new user profile' })
  create(@Req() req: any, @Body() body: any) {
    return this.usersService.create(req.user, body);
  }

  @Put(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update user profile details' })
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.usersService.update(req.user, id, body);
  }

  @Patch(':id/reset-password')
  @Roles('Admin')
  @ApiOperation({ summary: 'Reset user password' })
  resetPassword(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.usersService.resetPassword(req.user, id, body);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Get active device sessions for current account' })
  getSessions(@Req() req: any) {
    return this.usersService.getSessions(req.user);
  }

  @Get('sessions/stats')
  @ApiOperation({ summary: 'Get active session statistics (total, unique IPs, devices)' })
  getSessionStats(@Req() req: any) {
    return this.usersService.getSessionStats(req.user);
  }

  @Delete('sessions/:id')
  @ApiOperation({ summary: 'Revoke active device session by ID' })
  revokeSession(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.usersService.revokeSession(req.user, id);
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete user account' })
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(req.user, id);
  }
}
