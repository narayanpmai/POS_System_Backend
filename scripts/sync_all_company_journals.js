const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncAllCompanyJournals() {
  console.log(`🚀 Retroactively generating double-entry Journal Entries for ALL historical Sales, Purchases, Expenses, and Incomes across all companies...\n`);

  const companies = await prisma.company.findMany({ select: { id: true, name: true } });

  const defaultAccounts = [
    { code: '1000', name: 'Cash on Hand', type: 'ASSET', description: 'Main Cash Account' },
    { code: '1020', name: 'Bank Account', type: 'ASSET', description: 'Store Bank Account' },
    { code: '1300', name: 'Inventory Asset', type: 'ASSET', description: 'Store Inventory Asset' },
    { code: '2000', name: 'Accounts Payable', type: 'LIABILITY', description: 'Supplier Payables' },
    { code: '2100', name: 'Sales Tax Payable', type: 'LIABILITY', description: 'VAT / Tax Obligations' },
    { code: '3000', name: "Owner's Capital", type: 'EQUITY', description: 'Owner Initial Investment' },
    { code: '4000', name: 'Sales Revenue', type: 'REVENUE', description: 'Revenue from POS Sales' },
    { code: '4100', name: 'Other Income', type: 'REVENUE', description: 'Miscellaneous Income' },
    { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'EXPENSE', description: 'Direct Product Cost' },
    { code: '5100', name: 'Inventory Purchases', type: 'EXPENSE', description: 'Supplier Purchase Expenses' },
    { code: '5200', name: 'Operating Expenses', type: 'EXPENSE', description: 'General Store Expenses' },
  ];

  for (const comp of companies) {
    const companyId = comp.id;
    console.log(`📌 Processing Company [${companyId}] ${comp.name}...`);

    // Ensure Chart of Accounts
    const accMap = {};
    for (const acc of defaultAccounts) {
      let existing = await prisma.account.findFirst({ where: { code: acc.code, companyId } });
      if (!existing) {
        existing = await prisma.account.create({ data: { ...acc, companyId } });
      }
      accMap[acc.code] = existing.id;
    }

    // 1. Process Historical Sales
    const sales = await prisma.sale.findMany({
      where: { companyId },
      include: { items: true },
    });

    let salesJournalsCreated = 0;
    for (const sale of sales) {
      const existingJ = await prisma.journalEntry.findFirst({
        where: { referenceNo: sale.invoiceNo, companyId },
      });

      if (!existingJ) {
        let totalCost = 0;
        for (const item of sale.items) {
          totalCost += item.quantity * (item.cost || 0);
        }

        const subtotal = sale.subtotal || sale.totalAmount;
        const discountAmount = sale.discountAmount || 0;
        const taxAmount = sale.taxAmount || 0;
        const netRevenue = Number((subtotal - discountAmount).toFixed(2));
        const totalAmount = sale.totalAmount;

        await prisma.journalEntry.create({
          data: {
            company: { connect: { id: companyId } },
            referenceNo: sale.invoiceNo,
            description: `POS Sale - ${sale.invoiceNo}`,
            date: sale.createdAt,
            lines: {
              create: [
                { accountId: accMap['1000'], debit: totalAmount, credit: 0, description: 'Cash Received' },
                { accountId: accMap['4000'], debit: 0, credit: netRevenue > 0 ? netRevenue : totalAmount, description: 'Sales Revenue' },
                ...(taxAmount > 0 ? [{ accountId: accMap['2100'], debit: 0, credit: taxAmount, description: 'Sales Tax Payable' }] : []),
                ...(totalCost > 0 ? [
                  { accountId: accMap['5000'], debit: Number(totalCost.toFixed(2)), credit: 0, description: 'Cost of Goods Sold' },
                  { accountId: accMap['1300'], debit: 0, credit: Number(totalCost.toFixed(2)), description: 'Inventory Reduction' },
                ] : []),
              ],
            },
          },
        });
        salesJournalsCreated++;
      }
    }

    // 2. Process Historical Purchases
    const purchases = await prisma.purchase.findMany({
      where: { companyId },
    });

    let purchaseJournalsCreated = 0;
    for (const pur of purchases) {
      const existingJ = await prisma.journalEntry.findFirst({
        where: { referenceNo: pur.poNumber, companyId },
      });

      if (!existingJ) {
        await prisma.journalEntry.create({
          data: {
            company: { connect: { id: companyId } },
            referenceNo: pur.poNumber,
            description: `Inventory Purchase - ${pur.poNumber}`,
            date: pur.purchaseDate || pur.createdAt,
            lines: {
              create: [
                { accountId: accMap['1300'], debit: pur.totalAmount, credit: 0, description: 'Inventory Asset Increase' },
                { accountId: accMap['1000'], debit: 0, credit: pur.totalAmount, description: 'Cash Paid for Purchase' },
              ],
            },
          },
        });
        purchaseJournalsCreated++;
      }
    }

    // 3. Process Historical Expenses
    const expenses = await prisma.expense.findMany({ where: { companyId } });
    let expenseJournalsCreated = 0;
    for (const exp of expenses) {
      const ref = exp.referenceNo || `EXP-${exp.id}`;
      const existingJ = await prisma.journalEntry.findFirst({ where: { referenceNo: ref, companyId } });
      if (!existingJ) {
        await prisma.journalEntry.create({
          data: {
            company: { connect: { id: companyId } },
            referenceNo: ref,
            description: `Expense (${exp.category}): ${exp.description || 'Operating Expense'}`,
            date: exp.date || exp.createdAt,
            lines: {
              create: [
                { accountId: accMap['5200'], debit: exp.amount, credit: 0, description: `Expense - ${exp.category}` },
                { accountId: accMap['1000'], debit: 0, credit: exp.amount, description: 'Cash Paid for Expense' },
              ],
            },
          },
        });
        expenseJournalsCreated++;
      }
    }

    // 4. Process Historical Incomes
    const incomes = await prisma.income.findMany({ where: { companyId } });
    let incomeJournalsCreated = 0;
    for (const inc of incomes) {
      const ref = inc.referenceNo || `INC-${inc.id}`;
      const existingJ = await prisma.journalEntry.findFirst({ where: { referenceNo: ref, companyId } });
      if (!existingJ) {
        await prisma.journalEntry.create({
          data: {
            company: { connect: { id: companyId } },
            referenceNo: ref,
            description: `Income (${inc.category}): ${inc.description || 'Other Income'}`,
            date: inc.date || inc.createdAt,
            lines: {
              create: [
                { accountId: accMap['1000'], debit: inc.amount, credit: 0, description: 'Cash Received for Income' },
                { accountId: accMap['4100'], debit: 0, credit: inc.amount, description: `Revenue - ${inc.category}` },
              ],
            },
          },
        });
        incomeJournalsCreated++;
      }
    }

    console.log(`   └─ Generated Journal Entries: Sales (+${salesJournalsCreated}), Purchases (+${purchaseJournalsCreated}), Expenses (+${expenseJournalsCreated}), Incomes (+${incomeJournalsCreated})\n`);
  }

  console.log(`✨ All historical transactions across all companies are now 100% synchronized with the Accounting Ledger!`);
}

syncAllCompanyJournals()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
