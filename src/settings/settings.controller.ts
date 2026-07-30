import { Controller, Get, Put, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Store Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get store details, receipt templates, and tax rate configuration' })
  getSettings(@Req() req: any) {
    return this.settingsService.getSettings(req.user.companyId);
  }

  @Put()
  @Roles('Admin')
  @ApiOperation({ summary: 'Update store configuration (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Settings successfully updated' })
  updateSettings(@Req() req: any, @Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(req.user.companyId, dto);
  }

  @Get('backup/export')
  @Roles('Admin')
  @ApiOperation({ summary: 'Export complete tenant-scoped company data backup JSON (Admin Only)' })
  exportTenantBackup(@Req() req: any) {
    return this.settingsService.exportTenantBackup(req.user.companyId);
  }

  @Post('backup/import')
  @Roles('Admin')
  @ApiOperation({ summary: 'Restore / import tenant-scoped company data backup (Admin Only)' })
  importTenantBackup(@Req() req: any, @Body() body: any) {
    return this.settingsService.importTenantBackup(req.user.companyId, body);
  }
}
