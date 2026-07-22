const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Company"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "Company";`);
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"StoreSetting"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "StoreSetting";`);
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "User";`);
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Role"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "Role";`);
  console.log('Sequences fixed!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
