import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 0. Seed Default Company
  const defaultCompany = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'SmartPOS Default Company',
      email: 'admin@smartpos.com',
      phone: '+1 (555) 000-0000',
      address: '123 Smart Way',
    },
  });
  console.log('Default company seeded.');

  // 1. Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin', description: 'System Administrator with full access' },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Administrator privileges' },
  });

  const cashierRole = await prisma.role.upsert({
    where: { name: 'Cashier' },
    update: {},
    create: { name: 'Cashier', description: 'POS sales cashier privileges' },
  });

  console.log('Roles seeded.');

  // 2. Default Store Settings
  const defaultSettings = await prisma.storeSetting.upsert({
    where: { id: 1 },
    update: { currencySymbol: 'Rs.' },
    create: {
      id: 1,
      storeName: 'Antigravity Hyper POS',
      address: '100 Galaxy Way, Suite 2026, Silicon Valley, CA',
      phone: '+1 (555) 767-2026',
      email: 'sales@antigravitypos.com',
      taxNumber: 'VAT-US-202605',
      currencySymbol: 'Rs.',
      receiptHeader: 'Welcome to Antigravity SmartPOS!',
      receiptFooter: 'Thank you! Hope to see you again soon.',
      taxRateDefault: 12.0,
    },
  });

  console.log('Settings seeded.');

  // 3. Admin and Cashier Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const cashierPassword = await bcrypt.hash('cashier123', salt);

  const adminUser = await prisma.user.upsert({
    where: { email_companyId: { email: 'admin@pos.com', companyId: 1 } },
    update: { password: adminPassword, active: true, roleId: superAdminRole.id },
    create: {
      email: 'admin@pos.com',
      password: adminPassword,
      name: 'Super Admin User',
      roleId: superAdminRole.id,
      companyId: 1,
      active: true,
    },
  });

  const cashierUser = await prisma.user.upsert({
    where: { email_companyId: { email: 'cashier@pos.com', companyId: 1 } },
    update: { password: cashierPassword, active: true, roleId: cashierRole.id },
    create: {
      email: 'cashier@pos.com',
      password: cashierPassword,
      name: 'Cashier Emma',
      roleId: cashierRole.id,
      companyId: 1,
      active: true,
    },
  });

  console.log('Users seeded (Admin: admin@pos.com / admin123).');

  // 4. Categories
  const categories = [
    // Standard Groceries
    { name: 'Fresh Produce', description: 'Fresh fruits and vegetables' },
    { name: 'Dairy & Eggs', description: 'Milk, cheese, butter, and eggs' },
    { name: 'Meat & Seafood', description: 'Fresh and frozen meat, poultry, and seafood' },
    { name: 'Bakery & Breads', description: 'Fresh baked breads, pastries, and cakes' },
    { name: 'Beverages', description: 'Juices, soft drinks, water, tea, and coffee' },
    { name: 'Snacks & Sweets', description: 'Chips, chocolates, candies, and cookies' },
    { name: 'Pantry Staples', description: 'Rice, flour, pasta, oils, spices, and sauces' },
    { name: 'Frozen Foods', description: 'Frozen meals, vegetables, and ice cream' },
    { name: 'Canned Goods', description: 'Canned beans, soups, and vegetables' },
    { name: 'Personal Care', description: 'Soap, shampoo, toothpaste, and hygiene products' },
    { name: 'Household & Cleaning', description: 'Detergents, cleaners, and paper products' },
    { name: 'Baby Items', description: 'Baby food, diapers, and baby care' },
    // Organic Groceries
    { name: 'Organic Fresh Produce', description: 'Certified organic fruits and vegetables' },
    { name: 'Organic Dairy', description: 'Organic milk, cheese, and butter' },
    { name: 'Organic Meat & Poultry', description: 'Organic and free-range meat' },
    { name: 'Organic Pantry Staples', description: 'Organic grains, pulses, and spices' },
    { name: 'Organic Snacks', description: 'Healthy and organic snacking options' },
    { name: 'Organic Beverages', description: 'Organic juices, teas, and coffees' },
    { name: 'Organic Baby Food', description: 'Organic purees and snacks for babies' },
    { name: 'Vegan & Plant-Based', description: 'Plant-based meat and dairy alternatives' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name_companyId: { name: cat.name, companyId: 1 } },
      update: {},
      create: {
        name: cat.name,
        description: cat.description,
      },
    });
  }
  console.log('Categories seeded (Grocery and Organic).');

  // 5. Expense Categories
  const expenseCategories = [
    { name: 'Rent & Lease', description: 'Store or warehouse rent and lease payments' },
    { name: 'Utilities', description: 'Electricity, water, internet, and phone bills' },
    { name: 'Salaries & Wages', description: 'Employee salaries, wages, and bonuses' },
    { name: 'Marketing & Advertising', description: 'Promotions, ads, and marketing materials' },
    { name: 'Maintenance & Repairs', description: 'Equipment and facility maintenance' },
    { name: 'Office Supplies', description: 'Stationery, printing, and general office items' },
    { name: 'Logistics & Transportation', description: 'Shipping, delivery, and fuel costs' },
    { name: 'Taxes & Licenses', description: 'Government taxes, permits, and license fees' },
    { name: 'Miscellaneous', description: 'Other unclassified expenses' },
  ];

  for (const cat of expenseCategories) {
    await prisma.expenseCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        description: cat.description,
      },
    });
  }
  console.log('Expense Categories seeded.');

  // 6. Income Categories
  const incomeCategories = [
    { name: 'Sales Revenue', description: 'Income from direct product sales' },
    { name: 'Service Charge', description: 'Income from services, repairs, or delivery' },
    { name: 'Wholesale Income', description: 'Income from bulk wholesale orders' },
    { name: 'Export Income', description: 'Income from exported goods' },
    { name: 'Commission Income', description: 'Commissions earned from third-party products' },
    { name: 'Rental Income', description: 'Income from renting out equipment or space' },
    { name: 'Miscellaneous Income', description: 'Other unclassified income sources' },
  ];

  for (const cat of incomeCategories) {
    await prisma.incomeCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        description: cat.description,
      },
    });
  }
  console.log('Income Categories seeded.');

  // 7. Membership Tiers (CRM)
  const tiers = [
    { name: 'Bronze', minPoints: 0, discountPercent: 0 },
    { name: 'Silver', minPoints: 500, discountPercent: 2.5 },
    { name: 'Gold', minPoints: 2000, discountPercent: 5.0 },
    { name: 'Platinum', minPoints: 5000, discountPercent: 10.0 }
  ];

  for (const tier of tiers) {
    await prisma.membershipTier.create({
      data: tier
    });
  }
  console.log('Membership Tiers seeded.');

  // 8. Default Chart of Accounts (Accounting)
  const accounts = [
    { code: '1000', name: 'Cash', type: 'ASSET' },
    { code: '1010', name: 'Bank', type: 'ASSET' },
    { code: '1200', name: 'Accounts Receivable', type: 'ASSET' },
    { code: '1300', name: 'Inventory', type: 'ASSET' },
    { code: '2000', name: 'Accounts Payable', type: 'LIABILITY' },
    { code: '2100', name: 'Sales Tax Payable', type: 'LIABILITY' },
    { code: '3000', name: 'Owner Equity', type: 'EQUITY' },
    { code: '4000', name: 'Sales Revenue', type: 'REVENUE' },
    { code: '4100', name: 'Service Revenue', type: 'REVENUE' },
    { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'EXPENSE' },
    { code: '6000', name: 'Rent Expense', type: 'EXPENSE' },
    { code: '6100', name: 'Utilities Expense', type: 'EXPENSE' },
    { code: '6200', name: 'Payroll Expense', type: 'EXPENSE' }
  ];

  for (const acc of accounts) {
    await prisma.account.create({
      data: acc
    });
  }
  console.log('Chart of Accounts seeded.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
