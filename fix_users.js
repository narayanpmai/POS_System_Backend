const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  await prisma.user.updateMany({
    where: { email: { in: ['arpana.shrestha36@gmail.com', 'narayanpmai@gmail.com'] } },
    data: { companyId: 2 }
  });
  console.log("Fixed company IDs for Arpana and Narayan.");
}

fix().catch(console.error).finally(() => prisma.$disconnect());
