const { PrismaClient } = require('@prisma/client');
const { AsyncLocalStorage } = require('async_hooks');
const tenantContext = new AsyncLocalStorage();

const prisma = new PrismaClient();
const extendedPrisma = prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const store = tenantContext.getStore();
        const companyId = store?.companyId;

        const nonTenantModels = ['Role', 'Company', 'SaleItem', 'PurchaseItem'];
        
        if (nonTenantModels.includes(model) || !companyId) {
          return query(args);
        }

        const readOperations = ['findUnique', 'findUniqueOrThrow', 'findFirst', 'findFirstOrThrow', 'findMany', 'count', 'aggregate', 'groupBy'];
        const writeOperations = ['update', 'updateMany', 'delete', 'deleteMany'];
        
        if (operation === 'findUnique' || operation === 'findUniqueOrThrow' || operation === 'delete') {
           return query(args);
        }

        if (readOperations.includes(operation) || writeOperations.includes(operation)) {
          args.where = { ...args.where, companyId };
        } else if (operation === 'create' || operation === 'createMany') {
          if (Array.isArray(args.data)) {
            args.data = args.data.map(d => ({ ...d, companyId }));
          } else {
            args.data = { ...args.data, companyId };
          }
        } else if (operation === 'upsert') {
          args.where = { ...args.where, companyId };
          args.create = { ...args.create, companyId };
        }

        return query(args);
      },
    },
  },
});

async function main() {
  await prisma.$connect();
  
  console.log('--- Creating Company B ---');
  const compB = await prisma.company.create({
    data: { name: 'Company B (Test)' }
  });
  
  console.log('--- Testing Company A (ID: 1) ---');
  await tenantContext.run({ companyId: 1 }, async () => {
    const productsA = await extendedPrisma.product.findMany();
    console.log(`Company A Product Count: ${productsA.length}`);
    
    // Create product in A
    const cat = await extendedPrisma.category.findFirst();
    if (cat) {
      await extendedPrisma.product.create({
        data: {
          name: 'Product A1',
          SKU: 'A1-SKU',
          price: 100,
          cost: 80,
          categoryId: cat.id
        }
      });
      console.log('Created Product A1 in Company A');
    }
  });

  console.log('--- Testing Company B (ID: ' + compB.id + ') ---');
  await tenantContext.run({ companyId: compB.id }, async () => {
    const productsB = await extendedPrisma.product.findMany();
    console.log(`Company B Product Count: ${productsB.length}`);
    
    // Create product in B
    // Wait, Company B doesn't have categories. Let's create one.
    const catB = await extendedPrisma.category.create({
      data: { name: 'Category B1' }
    });
    
    await extendedPrisma.product.create({
      data: {
        name: 'Product B1',
        SKU: 'B1-SKU',
        price: 200,
        cost: 150,
        categoryId: catB.id
      }
    });
    console.log('Created Product B1 in Company B');
    
    const productsB_After = await extendedPrisma.product.findMany();
    console.log(`Company B Product Count after creation: ${productsB_After.length}`);
  });

  // Verify A again
  console.log('--- Verifying Company A again ---');
  await tenantContext.run({ companyId: 1 }, async () => {
    const productsA = await extendedPrisma.product.findMany();
    console.log(`Company A Product Count final: ${productsA.length}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
