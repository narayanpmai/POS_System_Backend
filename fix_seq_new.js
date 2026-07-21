const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const tables = ['Company', 'User', 'Role', 'StoreSetting', 'FiscalYear', 'Category', 'Product'];
  
  for (const table of tables) {
    try {
      // PostgreSQL sequence fix
      await prisma.$executeRawUnsafe(`SELECT setval('"${table}_id_seq"', COALESCE((SELECT MAX(id) FROM "${table}"), 1));`);
      console.log('Fixed sequence for table:', table);
    } catch(e) { 
      console.log('Failed for table:', table, e.message); 
    }
  }
}

run().then(() => prisma.$disconnect());
