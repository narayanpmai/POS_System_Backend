import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.company.findMany({
      include: {
        users: {
          select: { id: true, name: true, email: true, active: true, role: { select: { name: true } } },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true, name: true, email: true, active: true, role: { select: { name: true } } },
        },
      },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(data: { 
    name: string; 
    email?: string; 
    phone?: string; 
    address?: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
  }) {
    if (!data.adminEmail || !data.adminPassword) {
      throw new BadRequestException('Admin email and password are required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.adminEmail }
    });
    
    if (existingUser) {
      throw new BadRequestException('A user with this admin email already exists.');
    }

    const adminRole = await this.prisma.role.findUnique({
      where: { name: 'Admin' }
    });

    if (!adminRole) {
      throw new BadRequestException('Admin role not found in the system');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.adminPassword, salt);

    return this.prisma.$transaction(async (prisma) => {
      const company = await prisma.company.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        },
      });

      await prisma.storeSetting.create({
        data: {
          companyId: company.id,
          storeName: company.name,
          address: company.address || '',
          phone: company.phone || '',
          email: company.email || '',
          currencySymbol: 'Rs.',
        },
      });

      await prisma.user.create({
        data: {
          email: data.adminEmail,
          password: hashedPassword,
          name: data.adminName || 'Admin User',
          roleId: adminRole.id,
          companyId: company.id,
          active: true,
        },
      });

      return company;
    });
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async assignAdmin(companyId: number, data: { userId?: number; email?: string; name?: string; password?: string }) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const adminRole = await this.prisma.role.findUnique({ where: { name: 'Admin' } });
    if (!adminRole) throw new BadRequestException('Admin role not found');

    // Option A: Re-assign an existing user ID to this company
    if (data.userId) {
      const user = await this.prisma.user.findUnique({ where: { id: Number(data.userId) } });
      if (!user) throw new NotFoundException('User not found');

      const updatedUser = await this.prisma.user.update({
        where: { id: Number(data.userId) },
        data: {
          companyId,
          active: true,
        },
      });

      return {
        success: true,
        message: `Assigned user "${updatedUser.name}" (${updatedUser.email}) to company "${company.name}".`,
      };
    }

    // Option B: Create a new Admin user or link by email
    if (!data.email) {
      throw new BadRequestException('Either userId or email is required to assign admin');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      const updatedUser = await this.prisma.user.update({
        where: { id: existingUser.id },
        data: { companyId, active: true },
      });
      return {
        success: true,
        message: `Existing user "${updatedUser.email}" linked to company "${company.name}".`,
      };
    }

    if (!data.password) {
      throw new BadRequestException('Password is required for creating a new Admin user');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name || 'Company Admin',
        password: hashedPassword,
        roleId: adminRole.id,
        companyId,
        active: true,
      },
    });

    return {
      success: true,
      message: `Created and assigned new Admin "${newUser.name}" (${newUser.email}) to company "${company.name}".`,
    };
  }

  async deleteCompany(id: number) {
    if (id === 1) {
      throw new BadRequestException('Cannot delete or deactivate default company #1.');
    }

    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    await this.prisma.company.update({
      where: { id },
      data: { isActive: false }
    });

    await this.prisma.user.updateMany({
      where: { companyId: id },
      data: { active: false }
    });

    return { success: true, message: 'Company deactivated successfully.' };
  }

  async flushCompanyData(companyId: number) {
    if (companyId === 1) {
      throw new BadRequestException('Cannot flush data for default system company #1.');
    }

    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    return this.prisma.$transaction(async (prisma) => {
      // Find all user IDs belonging to this company
      const companyUsers = await prisma.user.findMany({
        where: { companyId },
        select: { id: true },
      });
      const companyUserIds = companyUsers.map((u) => u.id);

      // 1. Delete Sale Returns & Purchase Returns
      await prisma.saleReturnItem.deleteMany({
        where: { OR: [{ saleReturn: { companyId } }, { saleReturn: { sale: { companyId } } }] },
      });
      await prisma.saleReturn.deleteMany({ where: { companyId } });

      await prisma.purchaseReturnItem.deleteMany({
        where: { OR: [{ purchaseReturn: { companyId } }, { purchaseReturn: { purchase: { companyId } } }] },
      });
      await prisma.purchaseReturn.deleteMany({ where: { companyId } });

      // 2. Delete SaleItems & Sales
      await prisma.saleItem.deleteMany({
        where: { OR: [{ sale: { companyId } }, { sale: { cashierId: { in: companyUserIds } } }] },
      });
      await prisma.sale.deleteMany({
        where: { OR: [{ companyId }, { cashierId: { in: companyUserIds } }] },
      });
      await prisma.deletedSale.deleteMany({ where: { companyId } });

      // 3. Delete PurchaseItems & Purchases
      await prisma.purchaseItem.deleteMany({
        where: { OR: [{ purchase: { companyId } }, { purchase: { userId: { in: companyUserIds } } }] },
      });
      await prisma.purchase.deleteMany({
        where: { OR: [{ companyId }, { userId: { in: companyUserIds } }] },
      });

      // 4. Delete InventoryTransactions, JournalEntries, Payments, Shifts, Logs
      await prisma.inventoryTransaction.deleteMany({
        where: { OR: [{ companyId }, { userId: { in: companyUserIds } }] },
      });
      await prisma.journalEntryLine.deleteMany({ where: { journalEntry: { companyId } } });
      await prisma.journalEntry.deleteMany({ where: { companyId } });
      await prisma.rewardPointHistory.deleteMany({ where: { companyId } });
      await prisma.paymentTransaction.deleteMany({ where: { companyId } });
      await prisma.shift.deleteMany({ where: { companyId } });
      await prisma.activityLog.deleteMany({
        where: { OR: [{ companyId }, { userId: { in: companyUserIds } }] },
      });

      // 5. Delete Products, Brands, Unit Conversions, Categories
      await prisma.unitConversion.deleteMany({ where: { companyId } });
      await prisma.product.deleteMany({ where: { companyId } });
      await prisma.brand.deleteMany({ where: { companyId } });
      await prisma.category.deleteMany({ where: { companyId } });

      // 6. Delete Expenses & Incomes
      await prisma.expense.deleteMany({ where: { companyId } });
      await prisma.expenseCategory.deleteMany({ where: { companyId } });
      await prisma.income.deleteMany({ where: { companyId } });
      await prisma.incomeCategory.deleteMany({ where: { companyId } });

      // 7. Delete Customers & Suppliers
      await prisma.customer.deleteMany({ where: { companyId } });
      await prisma.supplier.deleteMany({ where: { companyId } });

      return { success: true, message: `Successfully flushed all operational data for company "${company.name}".` };
    });
  }

  async deleteCompanyPermanently(companyId: number) {
    if (companyId === 1) {
      throw new BadRequestException('Cannot delete default system company #1.');
    }

    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    return this.prisma.$transaction(async (prisma) => {
      // Find all user IDs belonging to this company
      const companyUsers = await prisma.user.findMany({
        where: { companyId },
        select: { id: true },
      });
      const companyUserIds = companyUsers.map((u) => u.id);

      // 1. Delete all Return Items & Returns
      await prisma.saleReturnItem.deleteMany({
        where: { OR: [{ saleReturn: { companyId } }, { saleReturn: { sale: { companyId } } }] },
      });
      await prisma.saleReturn.deleteMany({ where: { companyId } });

      await prisma.purchaseReturnItem.deleteMany({
        where: { OR: [{ purchaseReturn: { companyId } }, { purchaseReturn: { purchase: { companyId } } }] },
      });
      await prisma.purchaseReturn.deleteMany({ where: { companyId } });

      // 2. Delete all Sale Items & Sales
      await prisma.saleItem.deleteMany({
        where: { OR: [{ sale: { companyId } }, { sale: { cashierId: { in: companyUserIds } } }] },
      });
      await prisma.sale.deleteMany({
        where: { OR: [{ companyId }, { cashierId: { in: companyUserIds } }] },
      });
      await prisma.deletedSale.deleteMany({ where: { companyId } });

      // 3. Delete all Purchase Items & Purchases
      await prisma.purchaseItem.deleteMany({
        where: { OR: [{ purchase: { companyId } }, { purchase: { userId: { in: companyUserIds } } }] },
      });
      await prisma.purchase.deleteMany({
        where: { OR: [{ companyId }, { userId: { in: companyUserIds } }] },
      });

      // 4. Delete InventoryTransactions, JournalEntries, Payments, Shifts, Logs
      await prisma.inventoryTransaction.deleteMany({
        where: { OR: [{ companyId }, { userId: { in: companyUserIds } }] },
      });
      await prisma.journalEntryLine.deleteMany({ where: { journalEntry: { companyId } } });
      await prisma.journalEntry.deleteMany({ where: { companyId } });
      await prisma.rewardPointHistory.deleteMany({ where: { companyId } });
      await prisma.paymentTransaction.deleteMany({ where: { companyId } });
      await prisma.shift.deleteMany({ where: { companyId } });
      await prisma.activityLog.deleteMany({
        where: { OR: [{ companyId }, { userId: { in: companyUserIds } }] },
      });

      // 5. Delete Products, Brands, Unit Conversions, Categories
      await prisma.unitConversion.deleteMany({ where: { companyId } });
      await prisma.product.deleteMany({ where: { companyId } });
      await prisma.brand.deleteMany({ where: { companyId } });
      await prisma.category.deleteMany({ where: { companyId } });

      // 6. Delete Expenses & Incomes
      await prisma.expense.deleteMany({ where: { companyId } });
      await prisma.expenseCategory.deleteMany({ where: { companyId } });
      await prisma.income.deleteMany({ where: { companyId } });
      await prisma.incomeCategory.deleteMany({ where: { companyId } });

      // 7. Delete Customers & Suppliers
      await prisma.customer.deleteMany({ where: { companyId } });
      await prisma.supplier.deleteMany({ where: { companyId } });

      // 8. Delete Configuration entities
      await prisma.storeSetting.deleteMany({ where: { companyId } });
      await prisma.fiscalYear.deleteMany({ where: { companyId } });
      await prisma.membershipTier.deleteMany({ where: { companyId } });
      await prisma.account.deleteMany({ where: { companyId } });

      // 9. Re-assign Super Admin users to Company #1
      const superAdminRole = await prisma.role.findUnique({ where: { name: 'Super Admin' } });
      if (superAdminRole) {
        await prisma.user.updateMany({
          where: { companyId, roleId: superAdminRole.id },
          data: { companyId: 1 },
        });
      }

      // 10. Delete all remaining Users belonging to this company
      await prisma.user.deleteMany({ where: { companyId } });

      // 11. Delete Company record itself
      await prisma.company.delete({ where: { id: companyId } });

      return { success: true, message: `Company "${company.name}" and all its data have been permanently deleted.` };
    });
  }
}
