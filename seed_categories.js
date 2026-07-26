const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Groceries (किराना)', description: 'Daily grocery items like rice, flour, oil' },
    { name: 'Dairy Products (डेरी उत्पादनहरू)', description: 'Milk, cheese, butter, yogurt' },
    { name: 'Beverages (पेय पदार्थ)', description: 'Juice, soda, water, tea, coffee' },
    { name: 'Snacks (खाजा)', description: 'Biscuits, chips, noodles' },
    { name: 'Personal Care (व्यक्तिगत हेरचाह)', description: 'Soap, shampoo, toothpaste' }
  ];

  const targetCompanyId = 3;

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name_companyId: { name: cat.name, companyId: targetCompanyId } },
      update: {},
      create: {
        name: cat.name,
        description: cat.description,
        companyId: targetCompanyId
      }
    });
  }
  console.log(`Categories seeded successfully for companyId ${targetCompanyId}.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
