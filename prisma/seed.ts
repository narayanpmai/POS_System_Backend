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

  // 3. Clean and parse environment variables
  const superAdminEmail = (process.env.SUPERADMIN_EMAIL || 'smartpanchpokhari@gmail.com').replace(/^["']|["']$/g, '').trim();
  const rawPassword = (process.env.SUPERADMIN_PASSWORD || 'admin123').replace(/^["']|["']$/g, '').trim();
  const superAdminName = (process.env.SUPERADMIN_NAME || 'Super Admin').replace(/^["']|["']$/g, '').trim();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(rawPassword, salt);

  // Safely upsert target Super Admin account by email to avoid unique constraint collisions
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

  // Also update password and activate all company admin accounts if they exist
  await prisma.user.updateMany({
    where: {
      OR: [
        { email: 'beingsonam17@gmail.com' },
        { email: 'smartpanchpokhari@gmail.com' },
        { email: 'ito.melamchimun@gmail.com' },
        { email: 'ito.panchpokharithangpalmun@gmail.com' },
        { email: 'admin@koselighar.com' },
        { email: 'admin@pos.com' },
        { email: 'admin@smartpos.com' },
      ],
    },
    data: {
      password: hashedPassword,
      active: true,
    },
  });

  console.log('--------------------------------------------------');
  console.log('✓ Super Admin Account Configured:');
  console.log(`  Email:    ${superAdminUser.email}`);
  console.log(`  Password: ${rawPassword}`);
  console.log('--------------------------------------------------');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
