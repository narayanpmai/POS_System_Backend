import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const companies = await prisma.company.findMany();
  console.log(companies.map(c => ({ id: c.id, name: c.name, storeName: (c as any).storeName })));
  
  const users = await prisma.user.findMany({
    select: { id: true, email: true, companyId: true, role: { select: { name: true } } }
  });
  console.log("Users counts by company:");
  const counts: Record<number, number> = {};
  users.forEach(u => {
    counts[u.companyId] = (counts[u.companyId] || 0) + 1;
  });
  console.log(counts);
}

main().finally(() => prisma.$disconnect());
