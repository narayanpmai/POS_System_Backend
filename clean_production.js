const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanProductionData() {
  console.log('Starting production data cleanup...');
  try {
    // 1. Delete transaction-level records
    await prisma.activityLog.deleteMany({});
    await prisma.shift.deleteMany({});
    await prisma.deletedSale.deleteMany({});
    
    // Journal & Accounts
    await prisma.journalEntryLine.deleteMany({});
    await prisma.journalEntry.deleteMany({});
    
    // Purchase Returns & Payments
    await prisma.purchaseReturn.deleteMany({});
    await prisma.paymentTransaction.deleteMany({});
    
    // 2. Sales
    await prisma.saleItem.deleteMany({});
    await prisma.sale.deleteMany({});
    
    // 3. Purchases
    await prisma.purchaseItem.deleteMany({});
    await prisma.purchase.deleteMany({});
    
    // 4. Inventory
    await prisma.inventoryTransaction.deleteMany({});
    
    // 5. Financial
    await prisma.expense.deleteMany({});
    await prisma.income.deleteMany({});
    
    // 6. Products & Brands (KEEP CATEGORIES)
    await prisma.product.deleteMany({});
    await prisma.brand.deleteMany({});
    
    // 7. Parties
    await prisma.supplier.deleteMany({});
    await prisma.customer.deleteMany({});
    
    // 8. Users - Delete all except Super Admin
    const superAdminRole = await prisma.role.findFirst({ where: { name: 'Super Admin' } });
    if (superAdminRole) {
      await prisma.user.deleteMany({
        where: {
          roleId: { not: superAdminRole.id }
        }
      });
      console.log('✓ Cleared all users except Super Admins');
    }

    // Keep Categories, Companies, Roles, Store Settings, Fiscal Years, Income/Expense Categories

    console.log('\n✅ Successfully cleaned production operational data.');
    console.log('   Preserved: Super Admins, Categories, Companies, Roles, and Settings.');
  } catch (error) {
    console.error('❌ Error cleaning data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanProductionData();
