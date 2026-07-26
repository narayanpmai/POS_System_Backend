const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const companies = await prisma.company.findMany();
  console.log(JSON.stringify(companies.map(c => ({
    id: c.id,
    name: c.name,
    email: c.email
  })), null, 2));
}

main().finally(() => prisma.$disconnect());
