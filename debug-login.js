const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Simulate what backend does when x-tenant-domain = 'shop1.localhost'
async function simulateLogin() {
  const hostname = 'shop1.localhost'; // This is what frontend sends
  const subdomain = hostname.split('.')[0]; // = 'shop1'
  
  console.log('Hostname:', hostname);
  console.log('Subdomain extracted:', subdomain);
  
  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { subdomain },
        { customDomain: hostname }
      ]
    }
  });
  
  console.log('Tenant found:', tenant);
  
  if (!tenant) {
    console.log('ERROR: Tenant not found! Login will fail because tenantId context is not set.');
    return;
  }
  
  console.log('tenantId would be:', tenant.id);
  
  // Now simulate finding user with tenantId injected
  const user = await prisma.user.findFirst({
    where: { email: 'admin@pos.com', tenantId: tenant.id }
  });
  console.log('User found with tenantId filter:', user ? user.email : 'NOT FOUND');
  
  await prisma.$disconnect();
}

simulateLogin().catch(console.error);
