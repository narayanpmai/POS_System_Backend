const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const companyId = 10;

  const categories = await prisma.category.findMany({
    where: { companyId },
    include: { _count: { select: { products: true, children: true } } }
  });

  console.log('All categories for company 10:');
  categories.forEach(c => {
    console.log(`ID: ${c.id} | Name: "${c.name}" | ParentID: ${c.parentId} | Products: ${c._count.products} | Children: ${c._count.children}`);
  });
}

main().finally(() => prisma.$disconnect());
