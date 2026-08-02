const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCompany10Incomes() {
  console.log(`🔍 Inspecting database for Company 10 (Melamchi KoseliGhar)...`);

  const [incomes, activeFy] = await Promise.all([
    prisma.income.findMany({ where: { companyId: 10 } }),
    prisma.fiscalYear.findFirst({ where: { companyId: 10, isActive: true } }),
  ]);

  console.log(`📌 Fiscal Year for Company 10:`, activeFy);
  console.log(`📌 Total Incomes in Income table for Company 10: ${incomes.length}`);
  console.log(`📌 Income Records:`, incomes);
}

checkCompany10Incomes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
