import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Administrator privileges' },
  });

  await prisma.role.upsert({
    where: { name: 'Cashier' },
    update: {},
    create: { name: 'Cashier', description: 'POS sales cashier privileges' },
  });

  // Default store settings
  await prisma.storeSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: 'SmartPOS Retail',
      address: 'Your Address',
      phone: 'Your Phone',
      email: 'info@smartpos.com',
      taxNumber: 'Your Tax Number',
      currencySymbol: 'Rs.',
      taxRateDefault: 13.0,
    },
  });

  // Admin user
  const hash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pos.com' },
    update: {},
    create: {
      email: 'admin@pos.com',
      password: hash,
      name: 'Super Admin',
      roleId: adminRole.id,
      active: true,
    },
  });

  console.log(`Admin created: ${admin.email} / admin123`);
  console.log('Change this password immediately after first login!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
