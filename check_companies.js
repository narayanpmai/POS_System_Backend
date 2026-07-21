const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const companies = await prisma.company.findMany();
  console.log('COMPANIES:', companies.map(c => ({ id: c.id, name: c.name })));
}
run().then(() => prisma.$disconnect());
