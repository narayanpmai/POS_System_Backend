const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  const allUsers = await prisma.user.findMany({
    include: { company: true, role: true }
  });
  console.log('Total users in DB:', allUsers.length);
  allUsers.forEach(u => {
    console.log(`[DB] ID: ${u.id} | Email: ${u.email} | Role: ${u.role?.name} | CompanyId: ${u.companyId} | CompanyName: ${u.company?.name}`);
  });

  const allCompanies = await prisma.company.findMany();
  console.log('\nTotal companies in DB:', allCompanies.length);
  allCompanies.forEach(c => {
    console.log(`[DB] Company ID: ${c.id} | Name: ${c.name} | Email: ${c.email}`);
  });
}

checkDb().finally(() => prisma.$disconnect());
