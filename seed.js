const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('=== Starting Seed Script ===');

  // 0. Seed Default Company
  const company = await prisma.company.upsert({
    where: { id: 1 },
    update: {
      name: 'SmartPOS Default Company',
      email: 'admin@smartpos.com',
    },
    create: {
      id: 1,
      name: 'SmartPOS Default Company',
      email: 'admin@smartpos.com',
      phone: '+1 (555) 000-0000',
      address: '123 Smart Way',
    },
  });
  console.log('✓ Default company ensured with ID:', company.id);

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

  console.log('✓ Roles ensured (Super Admin ID:', superAdminRole.id, ', Admin ID:', adminRole.id, ', Cashier ID:', cashierRole.id, ')');

  // 2. Default Store Settings
  await prisma.storeSetting.upsert({
    where: { id: 1 },
    update: { currencySymbol: 'Rs.', companyId: company.id },
    create: {
      id: 1,
      companyId: company.id,
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
  console.log('✓ Store settings ensured.');

  // 3. Admin and Cashier Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const cashierPassword = await bcrypt.hash('cashier123', salt);

  // Seed admin@pos.com
  const user1 = await prisma.user.upsert({
    where: { email_companyId: { email: 'admin@pos.com', companyId: company.id } },
    update: { password: adminPassword, active: true, roleId: superAdminRole.id, companyId: company.id },
    create: {
      email: 'admin@pos.com',
      password: adminPassword,
      name: 'Super Admin User',
      roleId: superAdminRole.id,
      companyId: company.id,
      active: true,
    },
  });
  console.log('✓ Seeded admin@pos.com (password: admin123, ID:', user1.id, ')');

  // Seed admin@smartpos.com
  const user2 = await prisma.user.upsert({
    where: { email_companyId: { email: 'admin@smartpos.com', companyId: company.id } },
    update: { password: adminPassword, active: true, roleId: superAdminRole.id, companyId: company.id },
    create: {
      email: 'admin@smartpos.com',
      password: adminPassword,
      name: 'SmartPOS Super Admin',
      roleId: superAdminRole.id,
      companyId: company.id,
      active: true,
    },
  });
  console.log('✓ Seeded admin@smartpos.com (password: admin123, ID:', user2.id, ')');

  // Seed cashier@pos.com
  const user3 = await prisma.user.upsert({
    where: { email_companyId: { email: 'cashier@pos.com', companyId: company.id } },
    update: { password: cashierPassword, active: true, roleId: cashierRole.id, companyId: company.id },
    create: {
      email: 'cashier@pos.com',
      password: cashierPassword,
      name: 'Cashier Emma',
      roleId: cashierRole.id,
      companyId: company.id,
      active: true,
    },
  });
  console.log('✓ Seeded cashier@pos.com (password: cashier123, ID:', user3.id, ')');

  console.log('=== Seed Completed Successfully ===');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
