const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Fix narayanpmai@gmail.com -> Panchpokhari (id: 3)
  await prisma.user.updateMany({
    where: { email: 'narayanpmai@gmail.com' },
    data: { companyId: 3 }
  });
  
  // Fix ito.melamchimun@gmail.com -> Melamchi KoseliGhar (id: 2)
  await prisma.user.updateMany({
    where: { email: 'ito.melamchimun@gmail.com' },
    data: { companyId: 2 }
  });
  
  // What about Kalpana Gimba? email is ito.melamchimun@gmail.com.
  // Wait, the screenshot says Kalpana Gimba is ito.melamchimun@gmail.com.
  // What about Arpana Shrestha? arpana.shrestha36@gmail.com
  // I will just put Arpana to Panchpokhari (id: 3) for now, or just leave it. The user only explicitly complained about narayanpmai.
  
  console.log("Database updated successfully.");
}

main().finally(() => prisma.$disconnect());
