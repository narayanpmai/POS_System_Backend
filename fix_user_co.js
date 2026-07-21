const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  await prisma.user.updateMany({
    where: { email: 'narayanpmai@gmail.com' },
    data: { companyId: 2 }
  });
  await prisma.user.updateMany({
    where: { email: 'arpana.shrestha36@gmail.com' },
    data: { companyId: 3 }
  });
  console.log('Fixed company IDs for Narayan and Arpana!');
}
run().then(() => prisma.$disconnect());
