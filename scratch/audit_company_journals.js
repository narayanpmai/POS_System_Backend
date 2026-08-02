const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function auditAllCompanies() {
  const companies = await prisma.company.findMany({ select: { id: true, name: true } });
  console.log(`🔍 Auditing ${companies.length} Companies for Sales, Purchases, Expenses, Incomes, and Journal Entries...\n`);

  for (const comp of companies) {
    const [salesCount, purchasesCount, expensesCount, incomesCount, journalCount, activeFy] = await Promise.all([
      prisma.sale.count({ where: { companyId: comp.id } }),
      prisma.purchase.count({ where: { companyId: comp.id } }),
      prisma.expense.count({ where: { companyId: comp.id } }),
      prisma.income.count({ where: { companyId: comp.id } }),
      prisma.journalEntry.count({ where: { companyId: comp.id } }),
      prisma.fiscalYear.findFirst({ where: { companyId: comp.id, isActive: true } }),
    ]);

    console.log(`🏢 Company [${comp.id}] ${comp.name}:
      - Active Fiscal Year: ${activeFy ? activeFy.name : '❌ NONE'}
      - Sales: ${salesCount}
      - Purchases: ${purchasesCount}
      - Expenses: ${expensesCount}
      - Incomes: ${incomesCount}
      - Journal Entries: ${journalCount}`);
  }
}

auditAllCompanies()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
