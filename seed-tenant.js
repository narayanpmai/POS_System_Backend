const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo tenant and user...');
  
  // Create Tenant
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'shop1' },
    update: {},
    create: {
      name: 'Demo Shop',
      subdomain: 'shop1',
    },
  });
  console.log('Tenant created:', tenant.name);

  // Create Role
  let role = await prisma.role.findFirst({
    where: { name: 'Admin', tenantId: tenant.id },
  });
  if (!role) {
    role = await prisma.role.create({
      data: {
        name: 'Admin',
        tenantId: tenant.id,
      },
    });
  }
  console.log('Role created:', role.name);

  // Create User
  const password = await bcrypt.hash('admin123', 10);
  let user = await prisma.user.findFirst({
    where: { email: 'admin@pos.com', tenantId: tenant.id },
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'admin@pos.com',
        name: 'Admin User',
        password: password,
        roleId: role.id,
        tenantId: tenant.id,
      },
    });
  }
  
  console.log('User created:', user.email);
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
