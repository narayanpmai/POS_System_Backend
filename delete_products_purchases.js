const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Cleaning up data...');
    
    // Purchase Returns
    await prisma.purchaseReturnItem.deleteMany({});
    await prisma.purchaseReturn.deleteMany({});
    
    // Purchases
    await prisma.purchaseItem.deleteMany({});
    await prisma.purchase.deleteMany({});
    
    // Sale Returns
    await prisma.saleReturnItem.deleteMany({});
    await prisma.saleReturn.deleteMany({});
    
    // Sales and Payment Transactions
    await prisma.paymentTransaction.deleteMany({});
    await prisma.saleItem.deleteMany({});
    await prisma.sale.deleteMany({});
    
    // Inventory Transactions
    await prisma.inventoryTransaction.deleteMany({});
    
    // Products
    await prisma.product.deleteMany({});
    
    console.log('Successfully deleted all Products, Purchases, and Sales data!');
  } catch (error) {
    console.error('Error during deletion:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
