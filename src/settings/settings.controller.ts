import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
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
  @ApiOperation({ summary: 'Get global store details, receipt templates, and tax rate configuration' })
  getSettings() {
    return this.prismaGet();
  }

  // helper to query settings
  private prismaGet() {
    return this.settingsService.getSettings();
  }

  @Put()
  @Roles('Admin')
  @ApiOperation({ summary: 'Update global store configuration (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Settings successfully updated' })
  updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(dto);
  }
}
