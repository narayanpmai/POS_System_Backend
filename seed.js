const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Running production seed.js...');

  // 0. Seed Default Company
  await prisma.company.upsert({
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
  console.log('Default company ensured.');

  // 1. Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin', description: 'System Administrator with full access' },
  });

  const cashierRole = await prisma.role.upsert({
    where: { name: 'Cashier' },
    update: {},
    create: { name: 'Cashier', description: 'POS sales cashier privileges' },
  });

  console.log('Roles ensured.');

  // 2. Default Store Settings
  await prisma.storeSetting.upsert({
    where: { id: 1 },
    update: { currencySymbol: 'Rs.' },
    create: {
      id: 1,
      storeName: 'KoseliGhar POS',
      address: 'Kathmandu, Nepal',
      phone: '+977 9800000000',
      email: 'sales@koselighar.com',
      taxNumber: 'VAT-NP-2026',
      currencySymbol: 'Rs.',
      receiptHeader: 'Welcome to KoseliGhar POS!',
      receiptFooter: 'Thank you! Visit again.',
      taxRateDefault: 13.0,
    },
  });

  // 3. Admin and Cashier Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const cashierPassword = await bcrypt.hash('cashier123', salt);

  await prisma.user.upsert({
    where: { email: 'admin@pos.com' },
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

  await prisma.user.upsert({
    where: { email: 'cashier@pos.com' },
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

  console.log('Successfully seeded admin@pos.com (admin123) and cashier@pos.com (cashier123).');
}

main()
  .catch((e) => {
    console.error('Seed error:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
