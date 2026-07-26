import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const role = await prisma.role.findFirst({ where: { name: 'Super Admin' } });
  if (!role) {
    console.error('Super Admin role not found!');
    return;
  }
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      name: 'Smart Panchpokhari',
      email: 'smartpanchpokhari@gmail.com',
      password: hashedPassword,
      roleId: role.id,
      companyId: 1, // Super admin is typically tied to the default company or it can access all
    }
  });
  
  console.log('User created:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
