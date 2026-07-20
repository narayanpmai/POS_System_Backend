const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Adding Super Admin role...');
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin', description: 'System Administrator with full access' },
  });

  console.log('Super Admin role ID:', superAdminRole.id);

  const usersToUpdate = await prisma.user.findMany({
    where: {
      OR: [
        { id: 1 },
        { email: 'admin@smartpos.com' },
        { email: 'admin@pos.com' }
      ]
    }
  });

  for (const u of usersToUpdate) {
    await prisma.user.update({
      where: { id: u.id },
      data: { roleId: superAdminRole.id }
    });
    console.log(`Assigned Super Admin role to user: ${u.email}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
