import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.storeSetting.findFirst();

    if (!settings) {
      // Create defaults if not found
      settings = await this.prisma.storeSetting.create({
        data: {
          storeName: 'SmartPOS Default Retail',
          address: '123 Retail St, Cityville',
          phone: '+1 555-0100',
          email: 'store@smartpos.com',
          taxNumber: 'TAX-000000',
          currencySymbol: 'Rs.',
          receiptHeader: 'Thank you for shopping with us!',
          receiptFooter: 'Please come again!',
          taxRateDefault: 13.0,
          invoicePrefix: 'PTRM',
        },
      });
    }

    return settings;
  }

  async updateSettings(dto: UpdateSettingsDto) {
    // Ensure default settings row exists for this tenant
    const settings = await this.getSettings();

    return this.prisma.storeSetting.update({
      where: { id: settings.id },
      data: dto,
    });
  }
}
