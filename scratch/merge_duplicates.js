const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const companyId = 10;

  // Find all categories named 'खाद्यान्न' for company 10
  const categories = await prisma.category.findMany({
    where: { name: 'खाद्यान्न', companyId },
    include: { _count: { select: { products: true, children: true } } }
  });

  console.log('Categories named खाद्यान्न:', JSON.stringify(categories, null, 2));

  if (categories.length > 1) {
    // Keep the one with products or lowest ID
    const primary = categories.find(c => c._count.products > 0) || categories[0];
    const duplicate = categories.find(c => c.id !== primary.id);

    console.log(`Primary ID: ${primary.id}, Duplicate ID: ${duplicate.id}`);

    // Move all subcategories from duplicate to primary
    await prisma.category.updateMany({
      where: { parentId: duplicate.id },
      data: { parentId: primary.id }
    });

    // Move all products from duplicate to primary
    await prisma.product.updateMany({
      where: { categoryId: duplicate.id },
      data: { categoryId: primary.id }
    });

    // Delete duplicate category
    await prisma.category.delete({
      where: { id: duplicate.id }
    });

    console.log(`Merged duplicate category ${duplicate.id} into primary ${primary.id}`);
  } else {
    console.log('No duplicate categories found.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
