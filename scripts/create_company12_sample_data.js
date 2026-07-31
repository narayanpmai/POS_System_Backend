const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSampleData() {
  const companyId = 12;
  console.log(`🚀 Creating sample Purchase & Sale transactions for Company ID [${companyId}] (Sherpa Trading Pvt Ltd)...`);

  // 1. Ensure Active Fiscal Year
  let activeFy = await prisma.fiscalYear.findFirst({ where: { companyId, isActive: true } });
  if (!activeFy) {
    activeFy = await prisma.fiscalYear.create({
      data: {
        name: '2083/84',
        startDate: new Date('2026-07-16T00:00:00.000Z'),
        endDate: new Date('2027-07-15T23:59:59.000Z'),
        isActive: true,
        companyId,
      },
    });
    console.log(`✨ Created and activated Fiscal Year [2083/84] for Company 12`);
  }

  // 2. Fetch sample products for Company 12
  const products = await prisma.product.findMany({ where: { companyId }, take: 2 });
  if (products.length === 0) {
    console.error('❌ No products found for Company ID 12. Run seed script first.');
    return;
  }

  const prod1 = products[0];
  const prod2 = products[1] || products[0];

  console.log(`📦 Target Products: 
  1. ID: ${prod1.id} | ${prod1.name} (Stock: ${prod1.stock}, Cost: Rs.${prod1.cost}, Price: Rs.${prod1.price})
  2. ID: ${prod2.id} | ${prod2.name} (Stock: ${prod2.stock}, Cost: Rs.${prod2.cost}, Price: Rs.${prod2.price})`);

  // 3. Ensure Default Chart of Accounts
  const defaultAccounts = [
    { code: '1000', name: 'Cash on Hand', type: 'ASSET', description: 'Main Cash Account' },
    { code: '1300', name: 'Inventory Asset', type: 'ASSET', description: 'Store Inventory Asset' },
    { code: '2000', name: 'Accounts Payable', type: 'LIABILITY', description: 'Supplier Payables' },
    { code: '2100', name: 'Sales Tax Payable', type: 'LIABILITY', description: 'VAT / Tax Obligations' },
    { code: '4000', name: 'Sales Revenue', type: 'REVENUE', description: 'Revenue from POS Sales' },
    { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'EXPENSE', description: 'Direct Product Cost' },
  ];

  const accMap = {};
  for (const acc of defaultAccounts) {
    let existing = await prisma.account.findFirst({ where: { code: acc.code, companyId } });
    if (!existing) {
      existing = await prisma.account.create({ data: { ...acc, companyId } });
    }
    accMap[acc.code] = existing.id;
  }

  // 4. Create Purchase Transaction
  const poNumber = `PUR-COMP12-${Date.now().toString().slice(-6)}`;
  const purQty1 = 20;
  const purCost1 = prod1.cost > 0 ? prod1.cost : 150;
  const purQty2 = 10;
  const purCost2 = prod2.cost > 0 ? prod2.cost : 350;
  const totalPurchase = (purQty1 * purCost1) + (purQty2 * purCost2);

  const purchase = await prisma.$transaction(async (tx) => {
    const pur = await tx.purchase.create({
      data: {
        poNumber,
        totalAmount: totalPurchase,
        purchaseDate: new Date(),
        userId: 158,
        status: 'RECEIVED',
        companyId,
        items: {
          create: [
            { productId: prod1.id, quantity: purQty1, costPrice: purCost1, total: purQty1 * purCost1, measurementUnit: prod1.unit },
            { productId: prod2.id, quantity: purQty2, costPrice: purCost2, total: purQty2 * purCost2, measurementUnit: prod2.unit },
          ],
        },
      },
    });

    // Update Product 1 Stock & WACP
    const wacp1 = Math.max(1, ((prod1.stock * prod1.cost) + (purQty1 * purCost1)) / (prod1.stock + purQty1));
    await tx.product.update({
      where: { id: prod1.id },
      data: { stock: { increment: purQty1 }, cost: Number(wacp1.toFixed(2)) },
    });
    await tx.inventoryTransaction.create({
      data: { productId: prod1.id, type: 'STOCK_IN', quantity: purQty1, reason: `Purchase ${poNumber}`, companyId, userId: 158 },
    });

    // Update Product 2 Stock & WACP
    const wacp2 = Math.max(1, ((prod2.stock * prod2.cost) + (purQty2 * purCost2)) / (prod2.stock + purQty2));
    await tx.product.update({
      where: { id: prod2.id },
      data: { stock: { increment: purQty2 }, cost: Number(wacp2.toFixed(2)) },
    });
    await tx.inventoryTransaction.create({
      data: { productId: prod2.id, type: 'STOCK_IN', quantity: purQty2, reason: `Purchase ${poNumber}`, companyId, userId: 158 },
    });

    // Accounting Journal Entry
    await tx.journalEntry.create({
      data: {
        companyId,
        referenceNo: poNumber,
        description: `Inventory Purchase - ${poNumber}`,
        lines: {
          create: [
            { accountId: accMap['1300'], debit: totalPurchase, credit: 0, description: 'Inventory Asset Increase' },
            { accountId: accMap['1000'], debit: 0, credit: totalPurchase, description: 'Cash Paid for Purchase' },
          ],
        },
      },
    });

    return pur;
  });

  console.log(`✅ PURCHASE CREATED SUCCESSFULLY! PO Number: [${purchase.poNumber}], Total: Rs.${totalPurchase}`);

  // 5. Create POS Sale Transaction
  const invoiceNo = `INV-COMP12-${Date.now().toString().slice(-6)}`;
  const sellQty1 = 3;
  const sellPrice1 = prod1.price > 0 ? prod1.price : 220;
  const sellQty2 = 2;
  const sellPrice2 = prod2.price > 0 ? prod2.price : 420;

  const subtotal = (sellQty1 * sellPrice1) + (sellQty2 * sellPrice2);
  const totalAmount = subtotal;
  const totalCost = (sellQty1 * purCost1) + (sellQty2 * purCost2);

  const sale = await prisma.$transaction(async (tx) => {
    const s = await tx.sale.create({
      data: {
        invoiceNo,
        cashierId: 158,
        subtotal,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount,
        paymentMethod: 'CASH',
        paymentStatus: 'PAID',
        companyId,
        items: {
          create: [
            { productId: prod1.id, quantity: sellQty1, price: sellPrice1, cost: purCost1, taxAmount: 0, total: sellQty1 * sellPrice1, saleUnit: prod1.unit },
            { productId: prod2.id, quantity: sellQty2, price: sellPrice2, cost: purCost2, taxAmount: 0, total: sellQty2 * sellPrice2, saleUnit: prod2.unit },
          ],
        },
      },
    });

    // Deduct stock for Product 1
    await tx.product.update({ where: { id: prod1.id }, data: { stock: { decrement: sellQty1 } } });
    await tx.inventoryTransaction.create({ data: { productId: prod1.id, type: 'STOCK_OUT', quantity: sellQty1, reason: `POS Sale ${invoiceNo}`, companyId, userId: 158 } });

    // Deduct stock for Product 2
    await tx.product.update({ where: { id: prod2.id }, data: { stock: { decrement: sellQty2 } } });
    await tx.inventoryTransaction.create({ data: { productId: prod2.id, type: 'STOCK_OUT', quantity: sellQty2, reason: `POS Sale ${invoiceNo}`, companyId, userId: 158 } });

    // Accounting Journal Entry
    await tx.journalEntry.create({
      data: {
        companyId,
        referenceNo: invoiceNo,
        description: `POS Sale - ${invoiceNo}`,
        lines: {
          create: [
            { accountId: accMap['1000'], debit: totalAmount, credit: 0, description: 'Cash Received' },
            { accountId: accMap['4000'], debit: 0, credit: totalAmount, description: 'Sales Revenue' },
            { accountId: accMap['5000'], debit: totalCost, credit: 0, description: 'Cost of Goods Sold' },
            { accountId: accMap['1300'], debit: 0, credit: totalCost, description: 'Inventory Reduction' },
          ],
        },
      },
    });

    return s;
  });

  console.log(`✅ POS SALE CREATED SUCCESSFULLY! Invoice: [${sale.invoiceNo}], Revenue: Rs.${totalAmount}, COGS: Rs.${totalCost}, Profit: Rs.${totalAmount - totalCost}`);
}

createSampleData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
