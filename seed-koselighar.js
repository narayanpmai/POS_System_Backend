/**
 * seed-koselighar.js
 * Seeds the Panchpokhari Koseli Ghar tenant with its custom domain,
 * roles (Admin, Manager, Cashier), and an initial admin user.
 *
 * Run: node seed-koselighar.js
 * (Reads from .env / DATABASE_URL)
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Panchpokhari Koseli Ghar tenant...');

  // ─── 1. Upsert Tenant ──────────────────────────────────────────────────
  let tenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { subdomain: 'koselighar' },
        { customDomain: 'koselighar.smartptrm.com' },
      ],
    },
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'Panchpokhari Koseli Ghar',
        subdomain: 'koselighar',
        customDomain: 'koselighar.smartptrm.com',
        isActive: true,
      },
    });
    console.log('✓ Tenant created:', tenant.name, '(id:', tenant.id + ')');
  } else {
    // Make sure custom domain is set
    tenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: { customDomain: 'koselighar.smartptrm.com', subdomain: 'koselighar' },
    });
    console.log('✓ Tenant already exists, updated:', tenant.name, '(id:', tenant.id + ')');
  }

  // ─── 2. Upsert Roles ───────────────────────────────────────────────────
  const rolesDef = [
    { name: 'Admin',   description: 'Full system access' },
    { name: 'Manager', description: 'Manage inventory, sales and reports' },
    { name: 'Cashier', description: 'POS and sales operations' },
  ];

  const roleMap = {};
  for (const r of rolesDef) {
    let role = await prisma.role.findFirst({ where: { name: r.name, tenantId: tenant.id } });
    if (!role) {
      role = await prisma.role.create({ data: { name: r.name, description: r.description, tenantId: tenant.id } });
      console.log('✓ Role created:', role.name, '(id:', role.id + ')');
    } else {
      console.log('  Role already exists:', role.name, '(id:', role.id + ')');
    }
    roleMap[r.name] = role;
  }

  // ─── 3. Upsert Admin User ──────────────────────────────────────────────
  const adminEmail = 'admin@pos.com';
  let adminUser = await prisma.user.findFirst({ where: { email: adminEmail, tenantId: tenant.id } });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin User',
        password: hashedPassword,
        roleId: roleMap['Admin'].id,
        tenantId: tenant.id,
        active: true,
      },
    });
    console.log('✓ Admin user created:', adminUser.email);
    console.log('  Password: admin123  ← CHANGE THIS in production!');
  } else {
    console.log('  Admin user already exists:', adminUser.email);
  }

  console.log('\n✅ Seed complete!');
  console.log('   Tenant ID:', tenant.id);
  console.log('   Domain:   koselighar.smartptrm.com');
  console.log('   Login:    admin@pos.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
