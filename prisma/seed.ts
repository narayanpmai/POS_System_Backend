import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Administrator privileges' },
  });

  const cashierRole = await prisma.role.upsert({
    where: { name: 'Cashier' },
    update: {},
    create: { name: 'Cashier', description: 'POS sales cashier privileges' },
  });

  console.log('Roles seeded.');

  // 2. Default Store Settings
  const defaultSettings = await prisma.storeSetting.upsert({
    where: { id: 1 },
    update: { currencySymbol: 'Rs.' },
    create: {
      id: 1,
      storeName: 'Antigravity Hyper POS',
      address: '100 Galaxy Way, Suite 2026, Silicon Valley, CA',
      phone: '+1 (555) 767-2026',
      email: 'sales@antigravitypos.com',
      taxNumber: 'VAT-US-202605',
      currencySymbol: 'Rs.',
      receiptHeader: 'Welcome to Antigravity SmartPOS!',
      receiptFooter: 'Thank you! Hope to see you again soon.',
      taxRateDefault: 12.0,
    },
  });

  console.log('Settings seeded.');

  // 3. Admin and Cashier Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const cashierPassword = await bcrypt.hash('cashier123', salt);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pos.com' },
    update: {},
    create: {
      email: 'admin@pos.com',
      password: adminPassword,
      name: 'Super Admin User',
      roleId: adminRole.id,
      active: true,
    },
  });

  const cashierUser = await prisma.user.upsert({
    where: { email: 'cashier@pos.com' },
    update: {},
    create: {
      email: 'cashier@pos.com',
      password: cashierPassword,
      name: 'Cashier Emma',
      roleId: cashierRole.id,
      active: true,
    },
  });

  console.log('Users seeded (Admin: admin@pos.com / admin123).');

  // 4. Categories
  const categories = [];
  const categoryNames = ['Beverages', 'Electronics', 'Groceries', 'Apparel', 'Hardware'];
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, description: `High-quality ${name} items` },
    });
    categories.push(cat);
  }
  console.log('Categories seeded.');

  // 5. Suppliers
  const suppliers = [];
  const supplierData = [
    { name: 'Apex Electronics', contactName: 'John Doe', email: 'sales@apexelectronics.com', phone: '+1 555-0101', address: '45 Tech Plaza' },
    { name: 'Fresh Foods Co', contactName: 'Jane Smith', email: 'orders@freshfoods.com', phone: '+1 555-0102', address: '12 Organic Way' },
    { name: 'Global Apparel supplier', contactName: 'Robert Johnson', email: 'contact@globalapparel.com', phone: '+1 555-0103', address: '88 Textile Blvd' }
  ];

  for (const sup of supplierData) {
    const s = await prisma.supplier.create({
      data: sup
    });
    suppliers.push(s);
  }
  console.log('Suppliers seeded.');

  // 6. Customers
  const customers = [];
  const customerData = [
    { name: 'Walk-In Customer', email: 'walkin@pos.com', phone: '0000000000', address: 'Counter 1', points: 0 },
    { name: 'John Doe', email: 'john@gmail.com', phone: '+1 555-0155', address: '50 Elm St', points: 150 },
    { name: 'Mary Smith', email: 'mary@yahoo.com', phone: '+1 555-0199', address: '101 Pine St', points: 280 },
    { name: 'Alex Geller', email: 'alex@outlook.com', phone: '+1 555-0210', address: '77 Oak Ave', points: 50 }
  ];

  for (const cust of customerData) {
    const c = await prisma.customer.create({
      data: cust
    });
    customers.push(c);
  }
  console.log('Customers seeded.');

  // 7. Products
  const productsData = [
    { name: 'Smart LCD Display 27"', SKU: 'ELE-DISP-27', barcode: '880901234501', price: 299.99, cost: 180.00, stock: 15, categoryIndex: 1, taxRate: 12.0 },
    { name: 'Wireless Ergonomic Mouse', SKU: 'ELE-MOUS-WL', barcode: '880901234502', price: 49.99, cost: 20.00, stock: 45, categoryIndex: 1, taxRate: 12.0 },
    { name: 'USB-C Mechanical Keyboard', SKU: 'ELE-KEYB-ME', barcode: '880901234503', price: 89.99, cost: 45.00, stock: 3, categoryIndex: 1, taxRate: 12.0 }, // low stock alert trigger
    { name: 'Organic Green Tea 20pc', SKU: 'BEV-TEA-GRN', barcode: '880901234504', price: 5.99, cost: 2.50, stock: 120, categoryIndex: 0, taxRate: 5.0 },
    { name: 'Fresh Arabica Beans 1kg', SKU: 'BEV-COF-ARA', barcode: '880901234505', price: 24.99, cost: 12.00, stock: 35, categoryIndex: 0, taxRate: 5.0 },
    { name: 'Cotton Premium T-Shirt (M)', SKU: 'APP-TSH-MED', barcode: '880901234506', price: 19.99, cost: 8.00, stock: 50, categoryIndex: 3, taxRate: 12.0 },
    { name: 'Denim Classic Jeans (32)', SKU: 'APP-JNS-DEN', barcode: '880901234507', price: 59.99, cost: 25.00, stock: 20, categoryIndex: 3, taxRate: 12.0 },
    { name: 'Extra Virgin Olive Oil 500ml', SKU: 'GRO-OIL-EVO', barcode: '880901234508', price: 12.49, cost: 6.00, stock: 40, categoryIndex: 2, taxRate: 0.0 }, // tax free
    { name: 'Organic Oatmeal 1kg', SKU: 'GRO-OAT-ORG', barcode: '880901234509', price: 7.99, cost: 3.50, stock: 2, categoryIndex: 2, taxRate: 5.0 }, // low stock alert trigger
    { name: 'Heavy Duty Hammer', SKU: 'HDW-HAM-HVY', barcode: '880901234510', price: 14.99, cost: 7.00, stock: 18, categoryIndex: 4, taxRate: 12.0 }
  ];

  const seededProducts = [];
  for (const p of productsData) {
    const prod = await prisma.product.create({
      data: {
        name: p.name,
        SKU: p.SKU,
        barcode: p.barcode,
        price: p.price,
        cost: p.cost,
        stock: p.stock,
        minStockAlert: 5,
        categoryId: categories[p.categoryIndex].id,
        taxRate: p.taxRate,
      }
    });
    seededProducts.push(prod);

    // Create Initial Stock-In transaction
    await prisma.inventoryTransaction.create({
      data: {
        productId: prod.id,
        type: 'STOCK_IN',
        quantity: p.stock,
        reason: 'Initial Seed Inventory',
        supplierId: suppliers[p.categoryIndex % suppliers.length].id,
        userId: adminUser.id,
      }
    });
  }
  console.log('Products & stock transactions seeded.');

  // 8. Create historical sales data for dashboard charts (last 7 days + today)
  console.log('Seeding sales statistics...');
  const now = new Date();
  const paymentMethods = ['CASH', 'CARD', 'QR'];

  // Add 10 transactions across the past few days
  for (let i = 6; i >= 0; i--) {
    const saleDate = new Date();
    saleDate.setDate(now.getDate() - i);
    saleDate.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 59));

    // 1 or 2 sales per day
    const salesOnDay = 1 + Math.floor(Math.random() * 2);

    for (let sIdx = 0; sIdx < salesOnDay; sIdx++) {
      // Pick random customer
      const cust = customers[Math.floor(Math.random() * customers.length)];
      // Pick 2-3 products
      const pCount = 2 + Math.floor(Math.random() * 2);
      const itemsData = [];
      let subtotal = 0;
      let taxAmount = 0;

      for (let pIdx = 0; pIdx < pCount; pIdx++) {
        const prod = seededProducts[Math.floor(Math.random() * seededProducts.length)];
        const qty = 1 + Math.floor(Math.random() * 2);
        const itemSubtotal = prod.price * qty;
        const itemTax = (itemSubtotal * (prod.taxRate / 100));
        subtotal += itemSubtotal;
        taxAmount += itemTax;

        itemsData.push({
          productId: prod.id,
          quantity: qty,
          price: prod.price,
          cost: prod.cost,
          taxAmount: itemTax,
          total: itemSubtotal + itemTax
        });
      }

      const discount = Math.random() > 0.7 ? 5.00 : 0.00;
      const total = subtotal + taxAmount - discount;

      const sale = await prisma.sale.create({
        data: {
          invoiceNo: `INV-2026-${i}${sIdx}${Math.floor(Math.random() * 1000)}`,
          customerId: cust.id,
          cashierId: cashierUser.id,
          subtotal: Number(subtotal.toFixed(2)),
          taxAmount: Number(taxAmount.toFixed(2)),
          discountAmount: discount,
          totalAmount: Number(total.toFixed(2)),
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          paymentStatus: 'PAID',
          createdAt: saleDate,
          items: {
            create: itemsData
          }
        }
      });

      // Deduct stocks
      for (const item of itemsData) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });

        // Record stock-out
        await prisma.inventoryTransaction.create({
          data: {
            productId: item.productId,
            type: 'STOCK_OUT',
            quantity: item.quantity,
            reason: `Sale ${sale.invoiceNo}`,
            userId: cashierUser.id,
            createdAt: saleDate
          }
        });
      }
    }
  }

  // 9. Seeding cashier shift logs
  await prisma.shift.create({
    data: {
      employeeId: cashierUser.id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0),
      endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0),
      cashStart: 100.00,
      cashEnd: 385.50,
      status: 'CLOSED',
    }
  });

  await prisma.shift.create({
    data: {
      employeeId: cashierUser.id,
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 30, 0),
      cashStart: 100.00,
      status: 'OPEN',
    }
  });

  // 10. Expenses
  console.log('Seeding expenses...');
  const expenseCategories = ['OPERATIONAL', 'CAPITAL', 'UNEXPECTED'];
  // We'll generate expenses across the last 3 years to show trends
  for (let yearOffset = 0; yearOffset < 3; yearOffset++) {
    for (let i = 0; i < 15; i++) {
      const expDate = new Date();
      expDate.setFullYear(now.getFullYear() - yearOffset);
      expDate.setMonth(Math.floor(Math.random() * 12));
      expDate.setDate(1 + Math.floor(Math.random() * 28));

      const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      let amount = 0;
      let description = '';

      if (category === 'OPERATIONAL') {
        amount = 500 + Math.random() * 2000;
        description = ['Rent', 'Electricity', 'Internet', 'Office Supplies', 'Staff Amenities'][Math.floor(Math.random() * 5)];
      } else if (category === 'CAPITAL') {
        amount = 5000 + Math.random() * 15000;
        description = ['New Computers', 'Store Renovation', 'POS Hardware', 'Furniture', 'Vehicle'][Math.floor(Math.random() * 5)];
      } else {
        amount = 100 + Math.random() * 1000;
        description = ['Plumbing Repair', 'Legal Fees', 'Fines', 'Emergency Maintenance', 'Spoilage'][Math.floor(Math.random() * 5)];
      }

      await prisma.expense.create({
        data: {
          category,
          amount: Number(amount.toFixed(2)),
          description,
          date: expDate,
          createdAt: expDate,
        }
      });
    }
  }

  // Generate historical sales for trend charts
  console.log('Seeding historical sales for trends...');
  for (let yearOffset = 0; yearOffset < 3; yearOffset++) {
    for (let i = 0; i < 30; i++) {
      const saleDate = new Date();
      saleDate.setFullYear(now.getFullYear() - yearOffset);
      saleDate.setMonth(Math.floor(Math.random() * 12));
      saleDate.setDate(1 + Math.floor(Math.random() * 28));
      
      const subtotal = 1000 + Math.random() * 5000;
      
      await prisma.sale.create({
        data: {
          invoiceNo: `INV-HIST-${yearOffset}-${i}${Math.floor(Math.random() * 1000)}`,
          cashierId: cashierUser.id,
          subtotal: Number(subtotal.toFixed(2)),
          taxAmount: Number((subtotal * 0.13).toFixed(2)),
          discountAmount: 0,
          totalAmount: Number((subtotal * 1.13).toFixed(2)),
          paymentMethod: 'CASH',
          paymentStatus: 'PAID',
          createdAt: saleDate,
        }
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
