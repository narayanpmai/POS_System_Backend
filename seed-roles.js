const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: 'Admin', description: 'Full system access', tenantId: 1 },
    { name: 'Manager', description: 'Manage inventory, sales and reports', tenantId: 1 },
    { name: 'Cashier', description: 'POS and sales operations', tenantId: 1 },
  ];

  for (const role of roles) {
    const existing = await prisma.role.findFirst({ where: { name: role.name, tenantId: role.tenantId } });
    if (!existing) {
      const created = await prisma.role.create({ data: role });
      console.log(`Created role: ${created.name} (id: ${created.id})`);
    } else {
      console.log(`Role already exists: ${existing.name} (id: ${existing.id})`);
    }
  }
  console.log('Roles seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
