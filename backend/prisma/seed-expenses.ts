import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding expense categories...');
  
  const defaultCategories = [
    { name: 'Rent & Utilities', description: 'Store rent, electricity, water bills' },
    { name: 'Salaries', description: 'Employee wages and bonuses' },
    { name: 'Office Supplies', description: 'Stationery, paper, ink' },
    { name: 'Travel & Lodging', description: 'Business travel and accommodation' },
    { name: 'Marketing', description: 'Advertising and promotions' },
    { name: 'Maintenance', description: 'Repairs and general maintenance' },
    { name: 'Miscellaneous', description: 'Other unclassified expenses' }
  ];

  for (const cat of defaultCategories) {
    const exists = await prisma.expenseCategory.findUnique({
      where: { name: cat.name }
    });
    
    if (!exists) {
      await prisma.expenseCategory.create({
        data: cat
      });
      console.log(`Created category: ${cat.name}`);
    } else {
      console.log(`Category already exists: ${cat.name}`);
    }
  }

  console.log('Finished seeding expense categories.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
