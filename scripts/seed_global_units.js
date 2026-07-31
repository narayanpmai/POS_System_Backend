const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedGlobalUnits() {
  console.log('🚀 Seeding Standard Global Unit Conversions for Companies...');

  const globalRules = [
    { baseUnit: 'kg', secondaryUnit: 'gram', conversionFactor: 1000 },
    { baseUnit: 'kg', secondaryUnit: 'g', conversionFactor: 1000 },
    { baseUnit: 'liter', secondaryUnit: 'ml', conversionFactor: 1000 },
    { baseUnit: 'ltr', secondaryUnit: 'ml', conversionFactor: 1000 },
    { baseUnit: 'dozen', secondaryUnit: 'pcs', conversionFactor: 12 },
    { baseUnit: 'box', secondaryUnit: 'pcs', conversionFactor: 30 },
    { baseUnit: 'carton', secondaryUnit: 'bottle', conversionFactor: 12 },
    { baseUnit: 'bag', secondaryUnit: 'kg', conversionFactor: 25 },
    { baseUnit: 'jar', secondaryUnit: 'liter', conversionFactor: 5 },
    { baseUnit: 'packet', secondaryUnit: 'gram', conversionFactor: 500 },
  ];

  const companiesToSeed = [1, 12];

  for (const cid of companiesToSeed) {
    const comp = await prisma.company.findUnique({ where: { id: cid } });
    if (!comp) continue;

    console.log(`📦 Seeding units for Company [${cid}] ${comp.name}...`);
    for (const r of globalRules) {
      const existing = await prisma.unitConversion.findFirst({
        where: {
          companyId: cid,
          productId: null,
          baseUnit: r.baseUnit,
          secondaryUnit: r.secondaryUnit,
        },
      });

      if (!existing) {
        await prisma.unitConversion.create({
          data: {
            companyId: cid,
            productId: null,
            baseUnit: r.baseUnit,
            secondaryUnit: r.secondaryUnit,
            conversionFactor: r.conversionFactor,
          },
        });
      }
    }
  }

  console.log('✅ Global Unit Conversions Seeded Successfully!');
}

seedGlobalUnits()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
