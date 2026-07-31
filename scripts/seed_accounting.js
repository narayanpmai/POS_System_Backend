const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAccounts() {
  console.log('🚀 Seeding Default Chart of Accounts for Companies...');

  const defaultAccounts = [
    { code: '1000', name: 'Cash on Hand', type: 'ASSET', description: 'Main Cash Account' },
    { code: '1300', name: 'Inventory Asset', type: 'ASSET', description: 'Store Inventory Asset' },
    { code: '2000', name: 'Accounts Payable', type: 'LIABILITY', description: 'Supplier Payables' },
    { code: '2100', name: 'Sales Tax Payable', type: 'LIABILITY', description: 'VAT / Tax Obligations' },
    { code: '4000', name: 'Sales Revenue', type: 'REVENUE', description: 'Revenue from POS Sales' },
    { code: '4100', name: 'Other Income', type: 'REVENUE', description: 'Miscellaneous Income' },
    { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'EXPENSE', description: 'Direct Product Cost' },
    { code: '5100', name: 'Inventory Purchases', type: 'EXPENSE', description: 'Supplier Purchase Expenses' },
    { code: '5200', name: 'Operating Expenses', type: 'EXPENSE', description: 'General Store Expenses' },
  ];

  const companies = await prisma.company.findMany();

  for (const comp of companies) {
    console.log(`📦 Seeding Accounts for Company [${comp.id}] ${comp.name}...`);
    for (const acc of defaultAccounts) {
      const existing = await prisma.account.findFirst({
        where: { code: acc.code, companyId: comp.id },
      });

      if (!existing) {
        await prisma.account.create({
          data: {
            code: acc.code,
            name: acc.name,
            type: acc.type,
            description: acc.description,
            companyId: comp.id,
          },
        });
      }
    }
  }

  console.log('✅ Default Chart of Accounts Seeded Successfully!');
}

seedAccounts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
