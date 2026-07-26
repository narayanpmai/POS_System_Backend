const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function runTest() {
  console.log('=== STARTING MULTI-TENANCY ISOLATION TEST ===');

  try {
    // 1. Clean all data using TRUNCATE CASCADE
    console.log('Cleaning all tables...');
    const tableNames = [
      'Company', 'User', 'Role', 'Customer', 'Supplier', 'Category', 'Product', 'Brand',
      'Purchase', 'PurchaseItem', 'InventoryTransaction', 'Sale', 'SaleItem', 'Shift',
      'ActivityLog', 'Expense', 'StoreSetting', 'ExpenseCategory', 'FiscalYear', 'Income',
      'IncomeCategory', 'DeletedSale', 'MembershipTier', 'RewardPointHistory', 'Account',
      'JournalEntry', 'JournalEntryLine', 'PurchaseReturn', 'PaymentTransaction'
    ];

    for (const table of tableNames) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    }
    console.log('✓ Successfully truncated all tables.');

    // 2. Re-create base Roles
    console.log('Seeding Roles...');
    const superAdminRole = await prisma.role.create({
      data: { name: 'Super Admin', description: 'System Administrator with full access' }
    });
    const adminRole = await prisma.role.create({
      data: { name: 'Admin', description: 'Administrator privileges' }
    });
    const cashierRole = await prisma.role.create({
      data: { name: 'Cashier', description: 'POS sales cashier privileges' }
    });
    console.log('✓ Roles seeded.');

    // 3. Create Companies
    console.log('Creating Companies...');
    const companyAlpha = await prisma.company.create({
      data: { name: 'Alpha Corp', email: 'info@alpha.com', phone: '111-222', address: 'Alpha St.' }
    });
    const companyBeta = await prisma.company.create({
      data: { name: 'Beta Corp', email: 'info@beta.com', phone: '333-444', address: 'Beta St.' }
    });
    console.log(`✓ Companies created: Alpha (ID: ${companyAlpha.id}), Beta (ID: ${companyBeta.id})`);

    // 4. Create Users (User email must be globally unique!)
    console.log('Creating Users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const userAlpha = await prisma.user.create({
      data: {
        email: 'admin@alpha.com',
        password: passwordHash,
        name: 'Alpha Admin',
        roleId: adminRole.id,
        companyId: companyAlpha.id,
        active: true
      }
    });

    const userBeta = await prisma.user.create({
      data: {
        email: 'admin@beta.com',
        password: passwordHash,
        name: 'Beta Admin',
        roleId: adminRole.id,
        companyId: companyBeta.id,
        active: true
      }
    });
    console.log('✓ Users created.');

    // Test Global User Email Uniqueness
    console.log('Testing User Email global uniqueness...');
    try {
      await prisma.user.create({
        data: {
          email: 'admin@alpha.com', // Duplicate
          password: passwordHash,
          name: 'Alpha Admin Clone',
          roleId: adminRole.id,
          companyId: companyBeta.id,
          active: true
        }
      });
      console.error('❌ FAIL: Allowed duplicate User email across different companies!');
    } catch (err) {
      console.log('✓ PASS: Successfully blocked duplicate User email (Global Uniqueness).');
    }

    // 5. Create Categories & Products for both Companies
    console.log('Creating Categories...');
    const catAlpha = await prisma.category.create({
      data: { name: 'Electronics', companyId: companyAlpha.id }
    });
    const catBeta = await prisma.category.create({
      data: { name: 'Groceries', companyId: companyBeta.id }
    });

    console.log('Creating Products...');
    // Create Product Alpha
    const prodAlpha = await prisma.product.create({
      data: {
        name: 'Alpha Laptop',
        SKU: 'LAPTOP-1',
        price: 1200,
        cost: 800,
        categoryId: catAlpha.id,
        companyId: companyAlpha.id
      }
    });

    // Create Product Beta - Same SKU but different company (should succeed!)
    console.log('Testing Product SKU uniqueness scoped by company...');
    try {
      const prodBeta = await prisma.product.create({
        data: {
          name: 'Beta Laptop',
          SKU: 'LAPTOP-1', // Same SKU
          price: 1500,
          cost: 1000,
          categoryId: catBeta.id,
          companyId: companyBeta.id
        }
      });
      console.log('✓ PASS: Product with same SKU allowed in different companies.');
    } catch (err) {
      console.error('❌ FAIL: Blocked same SKU in different companies!', err.message);
    }

    // Attempting same SKU in SAME company (should fail!)
    try {
      await prisma.product.create({
        data: {
          name: 'Alpha Laptop Clone',
          SKU: 'LAPTOP-1', // Same SKU, same company
          price: 1300,
          cost: 900,
          categoryId: catAlpha.id,
          companyId: companyAlpha.id
        }
      });
      console.error('❌ FAIL: Allowed duplicate SKU in same company!');
    } catch (err) {
      console.log('✓ PASS: Blocked duplicate SKU in same company.');
    }

    // 6. Create Customers (Phone number can be reused across companies)
    console.log('Testing Customer Phone uniqueness scoped by company...');
    const custAlpha = await prisma.customer.create({
      data: {
        name: 'John Doe Alpha',
        phone: '9876543210',
        companyId: companyAlpha.id
      }
    });

    try {
      const custBeta = await prisma.customer.create({
        data: {
          name: 'John Doe Beta',
          phone: '9876543210', // Same phone
          companyId: companyBeta.id
        }
      });
      console.log('✓ PASS: Allowed same Customer phone in different companies.');
    } catch (err) {
      console.error('❌ FAIL: Blocked same Customer phone in different companies!', err.message);
    }

    // Same customer phone in SAME company (should fail!)
    try {
      await prisma.customer.create({
        data: {
          name: 'John Doe Alpha Clone',
          phone: '9876543210',
          companyId: companyAlpha.id
        }
      });
      console.error('❌ FAIL: Allowed duplicate Customer phone in same company!');
    } catch (err) {
      console.log('✓ PASS: Blocked duplicate Customer phone in same company.');
    }

    // 7. Verify Data Fetching Isolation
    console.log('Verifying queries data isolation...');
    // Company Alpha query
    const alphaProducts = await prisma.product.findMany({ where: { companyId: companyAlpha.id } });
    console.log(`Company Alpha product count (expected 1): ${alphaProducts.length}`);
    if (alphaProducts.length === 1 && alphaProducts[0].name === 'Alpha Laptop') {
      console.log('✓ PASS: Company Alpha only fetches its own products.');
    } else {
      console.error('❌ FAIL: Company Alpha data isolation issue.');
    }

    // Company Beta query
    const betaProducts = await prisma.product.findMany({ where: { companyId: companyBeta.id } });
    console.log(`Company Beta product count (expected 1): ${betaProducts.length}`);
    if (betaProducts.length === 1 && betaProducts[0].name === 'Beta Laptop') {
      console.log('✓ PASS: Company Beta only fetches its own products.');
    } else {
      console.error('❌ FAIL: Company Beta data isolation issue.');
    }

    console.log('=== MULTI-TENANCY ISOLATION TEST COMPLETED SUCCESSFULLY ===');
  } catch (error) {
    console.error('❌ TEST RUN ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
