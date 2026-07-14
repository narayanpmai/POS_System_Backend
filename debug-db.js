const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function debug() {
  console.log('=== All Tenants ===');
  const tenants = await prisma.tenant.findMany();
  console.log(JSON.stringify(tenants, null, 2));
  
  console.log('\n=== All Users ===');
  const users = await prisma.user.findMany({ include: { role: true } });
  console.log(JSON.stringify(users.map(u => ({ id: u.id, email: u.email, tenantId: u.tenantId, roleId: u.roleId, roleName: u.role?.name })), null, 2));
  
  console.log('\n=== Password verify for admin@pos.com ===');
  const user = await prisma.user.findFirst({ where: { email: 'admin@pos.com' } });
  if (user) {
    const match = await bcrypt.compare('admin123', user.password);
    console.log('Password matches:', match);
    console.log('User tenantId:', user.tenantId);
  } else {
    console.log('User NOT found!');
  }
  
  await prisma.$disconnect();
}
debug().catch(console.error);
