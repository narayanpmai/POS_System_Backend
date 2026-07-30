const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const companyId = 10;

  const oldCat = await prisma.category.findUnique({ where: { id: 32 } });
  const newCat = await prisma.category.findUnique({ where: { id: 65 } });

  console.log(`Moving products from Cat ID ${oldCat.id} ("${oldCat.name}") to Cat ID ${newCat.id} ("${newCat.name}")...`);

  // Move products from oldCat to newCat
  const updatedProducts = await prisma.product.updateMany({
    where: { categoryId: oldCat.id },
    data: { categoryId: newCat.id }
  });

  console.log(`Updated ${updatedProducts.count} products!`);

  // Move any sub-categories if oldCat had any
  await prisma.category.updateMany({
    where: { parentId: oldCat.id },
    data: { parentId: newCat.id }
  });

  // Delete old duplicate category ID 32
  await prisma.category.delete({
    where: { id: oldCat.id }
  });

  console.log(`Successfully deleted duplicate category ID 32!`);

  // Clean trailing spaces for all category names for company 10
  const allCats = await prisma.category.findMany({ where: { companyId } });
  for (const cat of allCats) {
    if (cat.name !== cat.name.trim()) {
      await prisma.category.update({
        where: { id: cat.id },
        data: { name: cat.name.trim() }
      });
      console.log(`Trimmed category name: "${cat.name}" -> "${cat.name.trim()}"`);
    }
  }

  console.log('Cleanup completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
