const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const users = await prisma.user.findMany({ where: { companyId: { in: [2, 3] } } });
  console.log('USERS IN CO 2 OR 3:', users);
}
run().then(() => prisma.$disconnect());
