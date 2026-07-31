const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runIncomeExpenseDemo() {
  const companyId = 12;
  console.log(`🚀 Creating sample Expense & Income entries for Company ID [${companyId}] (Sherpa Trading Pvt Ltd)...`);

  // 1. Ensure Default Accounts
  const defaultAccounts = [
    { code: '1000', name: 'Cash on Hand', type: 'ASSET', description: 'Main Cash Account' },
    { code: '4100', name: 'Other Income', type: 'REVENUE', description: 'Miscellaneous Income' },
    { code: '5200', name: 'Operating Expenses', type: 'EXPENSE', description: 'General Store Expenses' },
  ];

  const accMap = {};
  for (const acc of defaultAccounts) {
    let existing = await prisma.account.findFirst({ where: { code: acc.code, companyId } });
    if (!existing) existing = await prisma.account.create({ data: { ...acc, companyId } });
    accMap[acc.code] = existing.id;
  }

  // 2. Create Sample Expense (Electricity & Maintenance Bill)
  const expRef = `EXP-COMP12-${Date.now().toString().slice(-5)}`;
  const expAmount = 2500;

  const expense = await prisma.$transaction(async (tx) => {
    const exp = await tx.expense.create({
      data: {
        referenceNo: expRef,
        category: 'OPERATIONAL',
        amount: expAmount,
        description: 'Store Electricity & Monthly Utilities',
        date: new Date(),
        companyId,
      },
    });

    await tx.journalEntry.create({
      data: {
        companyId,
        referenceNo: expRef,
        description: `Expense (OPERATIONAL): Store Electricity & Monthly Utilities`,
        lines: {
          create: [
            { accountId: accMap['5200'], debit: expAmount, credit: 0, description: 'Operating Expense - Utilities' },
            { accountId: accMap['1000'], debit: 0, credit: expAmount, description: 'Cash Paid for Utilities' },
          ],
        },
      },
    });

    return exp;
  });

  console.log(`✅ EXPENSE CREATED: Ref [${expense.referenceNo}], Amount: Rs.${expense.amount}`);

  // 3. Create Sample Income (Packaging & Export Fee)
  const incRef = `INC-COMP12-${Date.now().toString().slice(-5)}`;
  const incAmount = 5000;

  const income = await prisma.$transaction(async (tx) => {
    const inc = await tx.income.create({
      data: {
        referenceNo: incRef,
        category: 'EXPORT_FEE',
        amount: incAmount,
        description: 'Special Nepali Handicrafts Packaging & Export Fee',
        date: new Date(),
        companyId,
      },
    });

    await tx.journalEntry.create({
      data: {
        companyId,
        referenceNo: incRef,
        description: `Income (EXPORT_FEE): Special Nepali Handicrafts Packaging & Export Fee`,
        lines: {
          create: [
            { accountId: accMap['1000'], debit: incAmount, credit: 0, description: 'Cash Received for Export Service' },
            { accountId: accMap['4100'], debit: 0, credit: incAmount, description: 'Revenue - Export Fee' },
          ],
        },
      },
    });

    return inc;
  });

  console.log(`✅ INCOME CREATED: Ref [${income.referenceNo}], Amount: Rs.${income.amount}`);

  // 4. Financial Audit Summary for Company ID 12
  const [journalEntries, accounts] = await Promise.all([
    prisma.journalEntry.findMany({ where: { companyId }, include: { lines: { include: { account: true } } } }),
    prisma.account.findMany({ where: { companyId } }),
  ]);

  console.log(`\n==============================================`);
  console.log(`📊 COMPANY 12 FINANCIAL LEDGER SUMMARY`);
  console.log(`==============================================`);
  console.log(`Total Double-Entry Journal Entries Posted: ${journalEntries.length}`);

  for (const acc of accounts) {
    const lines = await prisma.journalEntryLine.findMany({ where: { accountId: acc.id } });
    const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
    const totalCredit = lines.reduce((s, l) => s + l.credit, 0);
    let balance = acc.type === 'ASSET' || acc.type === 'EXPENSE' ? totalDebit - totalCredit : totalCredit - totalDebit;
    console.log(`- Account [${acc.code}] ${acc.name} (${acc.type}): Balance = Rs.${balance.toLocaleString()} (Debit: Rs.${totalDebit}, Credit: Rs.${totalCredit})`);
  }
}

runIncomeExpenseDemo()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
