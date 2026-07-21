process.env.DATABASE_URL = 'postgresql://posuser:pospassword@localhost:5432/smartpos_db?schema=public';
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultCategories = [
  'Groceries (किराना)',
  'Dairy Products (डेरी उत्पादनहरू)',
  'Beverages (पेय पदार्थ)',
  'Snacks (खाजा)',
  'Personal Care (व्यक्तिगत हेरचाह)'
];

async function main() {
  console.log('Seeding default categories...');
  // For companyId 1, which is the default company
  for (const catName of defaultCategories) {
    const exists = await prisma.category.findUnique({
      where: {
        name_companyId: {
          name: catName,
          companyId: 1
        }
      }
    });

    if (!exists) {
      await prisma.category.create({
        data: {
          name: catName,
          companyId: 1,
          description: 'Default category'
        }
      });
      console.log(`Created category: ${catName}`);
    } else {
      console.log(`Category already exists: ${catName}`);
    }
  }
  console.log('Category seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
