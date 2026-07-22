const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('Starting Fiscal Year seeding...');
  
  // Deactivate any existing active fiscal years
  await prisma.fiscalYear.updateMany({
    data: { isActive: false }
  });

  // Create new active fiscal year
  const fy = await prisma.fiscalYear.upsert({
    where: { name: '2083/084' },
    update: {
      startDate: new Date('2026-07-17T00:00:00.000Z'),
      endDate: new Date('2027-07-16T23:59:59.000Z'),
      isActive: true,
      companyId: 1
    },
    create: {
      name: '2083/084',
      startDate: new Date('2026-07-17T00:00:00.000Z'),
      endDate: new Date('2027-07-16T23:59:59.000Z'),
      isActive: true,
      companyId: 1
    }
  });

  console.log('Seeded Fiscal Year successfully:', fy);
}

run()
  .catch(e => {
    console.error('Error seeding Fiscal Year:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
