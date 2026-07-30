import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Ensure Default Company exists
  const defaultCompany = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Koselighar',
      email: 'info@koselighar.com',
      phone: '+977-9800000000',
      address: 'Kathmandu, Nepal',
    },
  });
  console.log('✓ Default company verified.');

  // 2. Ensure Roles exist
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin', description: 'System Administrator with full access' },
  });

  await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Administrator privileges' },
  });

  await prisma.role.upsert({
    where: { name: 'Cashier' },
    update: {},
    create: { name: 'Cashier', description: 'POS sales cashier privileges' },
  });

  console.log('✓ System roles verified.');

  // 3. Super Admin Creation from Environment Variables
  const superAdminEmail = process.env.SUPERADMIN_EMAIL || 'admin@koselighar.com';
  const rawPassword = process.env.SUPERADMIN_PASSWORD || 'admin123';
  const superAdminName = process.env.SUPERADMIN_NAME || 'Super Admin';

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(rawPassword, salt);

  const superAdminUser = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      password: hashedPassword,
      name: superAdminName,
      roleId: superAdminRole.id,
      active: true,
      companyId: defaultCompany.id,
    },
    create: {
      email: superAdminEmail,
      password: hashedPassword,
      name: superAdminName,
      roleId: superAdminRole.id,
      active: true,
      companyId: defaultCompany.id,
    },
  });

  console.log(`✓ Super Admin seeded successfully: ${superAdminUser.email}`);
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
