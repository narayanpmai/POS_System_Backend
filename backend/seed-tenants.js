const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Restoring Tenant Companies and Users...');

  const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } });
  const cashierRole = await prisma.role.findUnique({ where: { name: 'Cashier' } });

  if (!adminRole || !cashierRole) {
    console.error('Roles not found! Run prisma seed first.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);

  // Recreate Company 2 (Melamchi KoseliGhar)
  const company2 = await prisma.company.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Melamchi KoseliGhar',
      email: 'ito.melamchimun@gmail.com',
      phone: '+977-123456',
      address: 'Melamchi, Sindhupalchok'
    }
  });
  console.log('✓ Restored Melamchi KoseliGhar');

  // Recreate Company 3 (Panchpokhari)
  const company3 = await prisma.company.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'पाँचपोखरी थाङपाल गाउँपालिका, सिन्धुपाल्चोक',
      email: 'ito.panchpokharithangpalmun@gmail.com',
      phone: '+977-654321',
      address: 'Thangpaldhap, Sindhupalchok'
    }
  });
  console.log('✓ Restored Panchpokhari Company');

  // Recreate Users
  const usersToCreate = [
    {
      email: 'arpana.shrestha36@gmail.com',
      name: 'Arpana Shrestha',
      roleId: adminRole.id,
      companyId: 1
    },
    {
      email: 'ito.melamchimun@gmail.com',
      name: 'Melamchi Admin',
      roleId: adminRole.id,
      companyId: company2.id
    },
    {
      email: 'narayanpmai@gmail.com',
      name: 'Narayan Prasad',
      roleId: adminRole.id,
      companyId: company3.id
    }
  ];

  for (const u of usersToCreate) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        password: passwordHash,
        name: u.name,
        roleId: u.roleId,
        companyId: u.companyId,
        active: true
      }
    });
    console.log(`✓ Restored user: ${u.email} (Password: admin123)`);
  }

  // Seed default categories for Company 3 to ensure user narayanpmai@gmail.com has categories
  console.log('Seeding categories for Company 3...');
  const categories = [
    { name: 'Fresh Produce', description: 'Fresh fruits and vegetables' },
    { name: 'Dairy & Eggs', description: 'Milk, cheese, butter, and eggs' },
    { name: 'Pantry Staples', description: 'Rice, flour, pasta, oils, spices, and sauces' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name_companyId: { name: cat.name, companyId: company3.id } },
      update: {},
      create: {
        name: cat.name,
        description: cat.description,
        companyId: company3.id
      }
    });
  }
  console.log('✓ Categories seeded for Company 3.');

  console.log('Tenant restore completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
