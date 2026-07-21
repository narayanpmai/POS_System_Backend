import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({ select: { name: true, email: true, role: { select: { name: true } } } });
  console.log(users);
}

check().catch(console.error).finally(() => prisma.$disconnect());
