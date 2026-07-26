const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDemoData() {
  console.log('Starting demo data cleanup...');
  try {
    // 1. Delete transaction-level records first (most dependent)
    await prisma.activityLog.deleteMany({});
    console.log('✓ Cleared ActivityLog');

    await prisma.shift.deleteMany({});
    console.log('✓ Cleared Shifts');

    await prisma.deletedSale.deleteMany({});
    console.log('✓ Cleared DeletedSales');

    // 2. Sale items before sales
    await prisma.saleItem.deleteMany({});
    await prisma.sale.deleteMany({});
    console.log('✓ Cleared Sales & SaleItems');

    // 3. Inventory transactions
    await prisma.inventoryTransaction.deleteMany({});
    console.log('✓ Cleared InventoryTransactions');

    // 4. Purchase items before purchases
    await prisma.purchaseItem.deleteMany({});
    await prisma.purchase.deleteMany({});
    console.log('✓ Cleared Purchases & PurchaseItems');

    // 5. Financial records
    await prisma.expense.deleteMany({});
    console.log('✓ Cleared Expenses');

    await prisma.income.deleteMany({});
    console.log('✓ Cleared Income');

    // 6. Catalog data
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.brand.deleteMany({});
    console.log('✓ Cleared Products, Categories & Brands');

    // 7. Parties
    await prisma.supplier.deleteMany({});
    await prisma.customer.deleteMany({});
    console.log('✓ Cleared Suppliers & Customers');

    // 8. Reference / lookup tables
    await prisma.expenseCategory.deleteMany({});
    await prisma.incomeCategory.deleteMany({});
    console.log('✓ Cleared ExpenseCategories & IncomeCategories');

    await prisma.fiscalYear.deleteMany({});
    console.log('✓ Cleared FiscalYears');

    console.log('\n✅ Successfully cleaned ALL demo operational data.');
    console.log('   Preserved: Users, Roles, and Store Settings.');
  } catch (error) {
    console.error('❌ Error cleaning data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDemoData();
