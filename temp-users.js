const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ include: { role: true, company: true } });
  console.log(JSON.stringify(users.map(u => ({
    id: u.id,
    email: u.email,
    role: u.role.name,
    companyId: u.companyId,
    companyName: u.company.name
  })), null, 2));
}

main().finally(() => prisma.$disconnect());
