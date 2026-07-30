import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database (Super Admin Only)...');

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

  // 2. Ensure System Roles exist
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

  // 3. Super Admin Account Creation / Verification ONLY
  const superAdminEmail = (process.env.SUPERADMIN_EMAIL || 'smartpanchpokhari@gmail.com').replace(/^["']|["']$/g, '').trim();
  const rawPassword = (process.env.SUPERADMIN_PASSWORD || 'admin123').replace(/^["']|["']$/g, '').trim();
  const superAdminName = (process.env.SUPERADMIN_NAME || 'Super Admin').replace(/^["']|["']$/g, '').trim();

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

  console.log('--------------------------------------------------');
  console.log('✓ Super Admin Account Verified:');
  console.log(`  Email:    ${superAdminUser.email}`);
  console.log('--------------------------------------------------');
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
