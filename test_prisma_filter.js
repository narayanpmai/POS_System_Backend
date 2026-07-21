const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({
    where: {
      role: {
        name: {
          not: 'Super Admin'
        }
      }
    },
    include: { role: true }
  });
  console.log("Filtered users count:", users.length);
  users.forEach(u => console.log(u.name, u.role.name));
}

check().catch(console.error).finally(() => prisma.$disconnect());
