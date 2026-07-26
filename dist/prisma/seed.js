"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const defaultCompany = await prisma.company.upsert({
        where: { id: 1 },
        update: { name: 'कोसेली घर (KoseliGhar)', logo: '/logo.png' },
        create: {
            id: 1,
            name: 'कोसेली घर (KoseliGhar)',
            email: 'admin@smartpos.com',
            phone: '+977-1-0000000',
            address: 'नेपाल (Nepal)',
            logo: '/logo.png',
        },
    });
    console.log('Default company seeded.');
    const superAdminRole = await prisma.role.upsert({
        where: { name: 'Super Admin' },
        update: {},
        create: { name: 'Super Admin', description: 'System Administrator with full access' },
    });
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
            roleId: superAdminRole.id,
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
    const categories = [
        { name: 'Fresh Produce', description: 'Fresh fruits and vegetables' },
        { name: 'Dairy & Eggs', description: 'Milk, cheese, butter, and eggs' },
        { name: 'Meat & Seafood', description: 'Fresh and frozen meat, poultry, and seafood' },
        { name: 'Bakery & Breads', description: 'Fresh baked breads, pastries, and cakes' },
        { name: 'Beverages', description: 'Juices, soft drinks, water, tea, and coffee' },
        { name: 'Snacks & Sweets', description: 'Chips, chocolates, candies, and cookies' },
        { name: 'Pantry Staples', description: 'Rice, flour, pasta, oils, spices, and sauces' },
        { name: 'Frozen Foods', description: 'Frozen meals, vegetables, and ice cream' },
        { name: 'Canned Goods', description: 'Canned beans, soups, and vegetables' },
        { name: 'Personal Care', description: 'Soap, shampoo, toothpaste, and hygiene products' },
        { name: 'Household & Cleaning', description: 'Detergents, cleaners, and paper products' },
        { name: 'Baby Items', description: 'Baby food, diapers, and baby care' },
        { name: 'Organic Fresh Produce', description: 'Certified organic fruits and vegetables' },
        { name: 'Organic Dairy', description: 'Organic milk, cheese, and butter' },
        { name: 'Organic Meat & Poultry', description: 'Organic and free-range meat' },
        { name: 'Organic Pantry Staples', description: 'Organic grains, pulses, and spices' },
        { name: 'Organic Snacks', description: 'Healthy and organic snacking options' },
        { name: 'Organic Beverages', description: 'Organic juices, teas, and coffees' },
        { name: 'Organic Baby Food', description: 'Organic purees and snacks for babies' },
        { name: 'Vegan & Plant-Based', description: 'Plant-based meat and dairy alternatives' },
    ];
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name_companyId: { name: cat.name, companyId: 1 } },
            update: {},
            create: {
                name: cat.name,
                description: cat.description,
            },
        });
    }
    console.log('Categories seeded (Grocery and Organic).');
    const expenseCategories = [
        { name: 'Rent & Lease', description: 'Store or warehouse rent and lease payments' },
        { name: 'Utilities', description: 'Electricity, water, internet, and phone bills' },
        { name: 'Salaries & Wages', description: 'Employee salaries, wages, and bonuses' },
        { name: 'Marketing & Advertising', description: 'Promotions, ads, and marketing materials' },
        { name: 'Maintenance & Repairs', description: 'Equipment and facility maintenance' },
        { name: 'Office Supplies', description: 'Stationery, printing, and general office items' },
        { name: 'Logistics & Transportation', description: 'Shipping, delivery, and fuel costs' },
        { name: 'Taxes & Licenses', description: 'Government taxes, permits, and license fees' },
        { name: 'Miscellaneous', description: 'Other unclassified expenses' },
    ];
    for (const cat of expenseCategories) {
        await prisma.expenseCategory.upsert({
            where: { name: cat.name },
            update: {},
            create: {
                name: cat.name,
                description: cat.description,
            },
        });
    }
    console.log('Expense Categories seeded.');
    const incomeCategories = [
        { name: 'Sales Revenue', description: 'Income from direct product sales' },
        { name: 'Service Charge', description: 'Income from services, repairs, or delivery' },
        { name: 'Wholesale Income', description: 'Income from bulk wholesale orders' },
        { name: 'Export Income', description: 'Income from exported goods' },
        { name: 'Commission Income', description: 'Commissions earned from third-party products' },
        { name: 'Rental Income', description: 'Income from renting out equipment or space' },
        { name: 'Miscellaneous Income', description: 'Other unclassified income sources' },
    ];
    for (const cat of incomeCategories) {
        await prisma.incomeCategory.upsert({
            where: { name: cat.name },
            update: {},
            create: {
                name: cat.name,
                description: cat.description,
            },
        });
    }
    console.log('Income Categories seeded.');
    const tiers = [
        { name: 'Bronze', minPoints: 0, discountPercent: 0 },
        { name: 'Silver', minPoints: 500, discountPercent: 2.5 },
        { name: 'Gold', minPoints: 2000, discountPercent: 5.0 },
        { name: 'Platinum', minPoints: 5000, discountPercent: 10.0 }
    ];
    for (const tier of tiers) {
        await prisma.membershipTier.create({
            data: tier
        });
    }
    console.log('Membership Tiers seeded.');
    const accounts = [
        { code: '1000', name: 'Cash', type: 'ASSET' },
        { code: '1010', name: 'Bank', type: 'ASSET' },
        { code: '1200', name: 'Accounts Receivable', type: 'ASSET' },
        { code: '1300', name: 'Inventory', type: 'ASSET' },
        { code: '2000', name: 'Accounts Payable', type: 'LIABILITY' },
        { code: '2100', name: 'Sales Tax Payable', type: 'LIABILITY' },
        { code: '3000', name: 'Owner Equity', type: 'EQUITY' },
        { code: '4000', name: 'Sales Revenue', type: 'REVENUE' },
        { code: '4100', name: 'Service Revenue', type: 'REVENUE' },
        { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'EXPENSE' },
        { code: '6000', name: 'Rent Expense', type: 'EXPENSE' },
        { code: '6100', name: 'Utilities Expense', type: 'EXPENSE' },
        { code: '6200', name: 'Payroll Expense', type: 'EXPENSE' }
    ];
    for (const acc of accounts) {
        await prisma.account.create({
            data: acc
        });
    }
    console.log('Chart of Accounts seeded.');
    const defaultFiscalYears = [
        { name: '२०८०/०८१', startDate: new Date('2023-07-17'), endDate: new Date('2024-07-15'), isActive: false, companyId: 1 },
        { name: '२०८१/०८२', startDate: new Date('2024-07-16'), endDate: new Date('2025-07-15'), isActive: true, companyId: 1 },
        { name: '२०८२/०८३', startDate: new Date('2025-07-16'), endDate: new Date('2026-07-15'), isActive: false, companyId: 1 },
    ];
    for (const fy of defaultFiscalYears) {
        const existingFy = await prisma.fiscalYear.findFirst({
            where: { name: fy.name, companyId: 1 }
        });
        if (!existingFy) {
            await prisma.fiscalYear.create({ data: fy });
        }
    }
    console.log('Default Nepali Fiscal Years (२०८०/०८१, २०८१/०८२, २०८२/०८३) seeded.');
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
//# sourceMappingURL=seed.js.map