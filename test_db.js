const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.findMany();
  console.log('Roles:', roles);
  const users = await prisma.user.findMany();
  console.log('Users:', users);
}

main().finally(() => prisma.$disconnect());
