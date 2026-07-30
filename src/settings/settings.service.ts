import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(companyId: number) {
    let settings = await this.prisma.storeSetting.findFirst({
      where: { companyId },
    });

    if (!settings) {
      const company = await this.prisma.company.findUnique({ where: { id: companyId } });
      settings = await this.prisma.storeSetting.create({
        data: {
          companyId,
          storeName: company?.name || 'KoseliGhar',
          address: company?.address || 'Nepal',
          phone: company?.phone || '',
          email: company?.email || '',
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

  async updateSettings(companyId: number, dto: UpdateSettingsDto) {
    // Ensure default settings row exists for this tenant
    const settings = await this.getSettings(companyId);

    return this.prisma.storeSetting.update({
      where: { id: settings.id },
      data: dto,
    });
  }
}
