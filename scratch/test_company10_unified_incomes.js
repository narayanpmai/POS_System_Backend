const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testUnifiedIncomes() {
  const [sales, incomes] = await Promise.all([
    prisma.sale.findMany({ where: { companyId: 10 }, take: 5, orderBy: { createdAt: 'desc' } }),
    prisma.income.findMany({ where: { companyId: 10 } }),
  ]);

  console.log(`📌 Company 10 POS Sales count: ${sales.length}`);
  console.log(`📌 Mapped Unified Incomes for Company 10:`);
  sales.forEach((s) => {
    console.log(`  - Invoice: ${s.invoiceNo} | Amount: Rs.${s.totalAmount} | Category: POS Sales Revenue`);
  });
}

testUnifiedIncomes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
