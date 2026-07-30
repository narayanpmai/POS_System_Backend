import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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

  async exportTenantBackup(companyId: number) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const [
      storeSettings,
      categories,
      brands,
      products,
      unitConversions,
      customers,
      suppliers,
      expenses,
      incomes,
      sales,
      purchases
    ] = await Promise.all([
      this.prisma.storeSetting.findFirst({ where: { companyId } }),
      this.prisma.category.findMany({ where: { companyId } }),
      this.prisma.brand.findMany(),
      this.prisma.product.findMany({ where: { companyId } }),
      this.prisma.unitConversion.findMany({ where: { companyId } }),
      this.prisma.customer.findMany({ where: { companyId } }),
      this.prisma.supplier.findMany({ where: { companyId } }),
      this.prisma.expense.findMany({ where: { companyId } }),
      this.prisma.income.findMany({ where: { companyId } }),
      this.prisma.sale.findMany({ where: { companyId }, include: { items: true } }),
      this.prisma.purchase.findMany({ where: { companyId }, include: { items: true } }),
    ]);

    return {
      system: 'KoseliGhar ERP/POS',
      version: '1.0',
      type: 'TENANT_SCOPED_BACKUP',
      companyId,
      companyName: company.name,
      exportedAt: new Date().toISOString(),
      summary: {
        categoriesCount: categories.length,
        brandsCount: brands.length,
        productsCount: products.length,
        customersCount: customers.length,
        suppliersCount: suppliers.length,
        salesCount: sales.length,
        purchasesCount: purchases.length,
      },
      data: {
        storeSettings,
        categories,
        brands,
        products,
        unitConversions,
        customers,
        suppliers,
        expenses,
        incomes,
        sales,
        purchases,
      },
    };
  }

  async importTenantBackup(companyId: number, backupPayload: any) {
    if (!backupPayload || !backupPayload.data) {
      throw new BadRequestException('Invalid tenant backup payload format');
    }

    const { data } = backupPayload;
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    return this.prisma.$transaction(async (tx) => {
      // 1. Restore Store Settings
      if (data.storeSettings) {
        const existingSettings = await tx.storeSetting.findFirst({ where: { companyId } });
        if (existingSettings) {
          await tx.storeSetting.update({
            where: { id: existingSettings.id },
            data: {
              storeName: data.storeSettings.storeName || company.name,
              address: data.storeSettings.address || company.address,
              phone: data.storeSettings.phone || company.phone,
              email: data.storeSettings.email || company.email,
              taxNumber: data.storeSettings.taxNumber,
              currencySymbol: data.storeSettings.currencySymbol || 'Rs.',
              receiptHeader: data.storeSettings.receiptHeader,
              receiptFooter: data.storeSettings.receiptFooter,
              taxRateDefault: data.storeSettings.taxRateDefault ?? 13,
              invoicePrefix: data.storeSettings.invoicePrefix || 'PTRM',
            },
          });
        }
      }

      // 2. Restore Categories
      if (Array.isArray(data.categories)) {
        for (const cat of data.categories) {
          const exists = await tx.category.findFirst({ where: { name: cat.name, companyId } });
          if (!exists) {
            await tx.category.create({
              data: { name: cat.name, companyId },
            });
          }
        }
      }

      // 3. Restore Brands
      if (Array.isArray(data.brands)) {
        for (const b of data.brands) {
          const exists = await tx.brand.findFirst({ where: { name: b.name } });
          if (!exists) {
            await tx.brand.create({
              data: { name: b.name, slug: b.slug || b.name.toLowerCase().replace(/\s+/g, '-') },
            });
          }
        }
      }

      // 4. Restore Customers
      if (Array.isArray(data.customers)) {
        for (const c of data.customers) {
          const exists = await tx.customer.findFirst({ where: { name: c.name, companyId } });
          if (!exists) {
            await tx.customer.create({
              data: { name: c.name, phone: c.phone, points: c.points || 0, companyId },
            });
          }
        }
      }

      // 5. Restore Suppliers
      if (Array.isArray(data.suppliers)) {
        for (const s of data.suppliers) {
          const exists = await tx.supplier.findFirst({ where: { name: s.name, companyId } });
          if (!exists) {
            await tx.supplier.create({
              data: { name: s.name, phone: s.phone, email: s.email, address: s.address, companyId },
            });
          }
        }
      }

      return {
        success: true,
        message: `Tenant backup successfully restored for company "${company.name}" (#${companyId}).`,
      };
    });
  }
}
