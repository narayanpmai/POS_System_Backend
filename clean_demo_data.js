const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDemoData() {
  console.log('Starting demo data cleanup...');
  try {
    // Delete in reverse dependency order
    await prisma.activityLog.deleteMany({});
    await prisma.shift.deleteMany({});
    
    await prisma.saleItem.deleteMany({});
    await prisma.sale.deleteMany({});
    
    await prisma.inventoryTransaction.deleteMany({});
    
    await prisma.purchaseItem.deleteMany({});
    await prisma.purchase.deleteMany({});
    
    await prisma.expense.deleteMany({});
    
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.brand.deleteMany({});
    
    await prisma.supplier.deleteMany({});
    await prisma.customer.deleteMany({});
    
    console.log('Successfully cleaned all demo operational data.');
    console.log('Preserved Users, Roles, and Store Settings.');
  } catch (error) {
    console.error('Error cleaning data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDemoData();
