const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, SKU: true, companyId: true, categoryId: true }
  });
  console.log('Total products:', products.length);
  console.log(JSON.stringify(products, null, 2));

  const companies = await prisma.company.findMany({ select: { id: true, name: true } });
  console.log('Companies:', JSON.stringify(companies, null, 2));
}

main().finally(() => prisma.$disconnect());
