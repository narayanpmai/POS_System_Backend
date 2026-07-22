const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const fys = await prisma.fiscalYear.findMany();
  console.log('FISCAL YEARS:', fys);
}
run().then(() => prisma.$disconnect());
