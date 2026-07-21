const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const users = await prisma.user.findMany();
  console.log('USERS:', users.map(u => ({ id: u.id, email: u.email, roleId: u.roleId, companyId: u.companyId })));
}
run().then(() => prisma.$disconnect());
