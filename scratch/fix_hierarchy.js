const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const companyId = 10;

  const root = await prisma.category.findFirst({ where: { name: 'खाद्यान्न', companyId } });
  const chamal = await prisma.category.findFirst({ where: { name: 'चामल', companyId } });
  const aalu = await prisma.category.findFirst({ where: { name: 'आलु', companyId } });

  console.log('Root:', root.id, 'Chamal:', chamal.id, 'Aalu:', aalu.id);

  // Link Chamal and Aalu under Root
  await prisma.category.update({ where: { id: chamal.id }, data: { parentId: root.id } });
  await prisma.category.update({ where: { id: aalu.id }, data: { parentId: root.id } });

  // Link Chamal children under Chamal
  const basmati = await prisma.category.findFirst({ where: { name: 'बासमती चामल', companyId } });
  const masino = await prisma.category.findFirst({ where: { name: 'मसिनो चामल', companyId } });
  const moto = await prisma.category.findFirst({ where: { name: 'मोटो चामल', companyId } });

  if (basmati) await prisma.category.update({ where: { id: basmati.id }, data: { parentId: chamal.id } });
  if (masino) await prisma.category.update({ where: { id: masino.id }, data: { parentId: chamal.id } });
  if (moto) await prisma.category.update({ where: { id: moto.id }, data: { parentId: chamal.id } });

  // Link Aalu children under Aalu
  const sthaniya = await prisma.category.findFirst({ where: { name: 'स्थानीय आलु', companyId } });
  const diamond = await prisma.category.findFirst({ where: { name: 'डायमण्ड आलु', companyId } });
  const prasodhita = await prisma.category.findFirst({ where: { name: 'प्रशोधित आलु', companyId } });

  if (sthaniya) await prisma.category.update({ where: { id: sthaniya.id }, data: { parentId: aalu.id } });
  if (diamond) await prisma.category.update({ where: { id: diamond.id }, data: { parentId: aalu.id } });
  if (prasodhita) await prisma.category.update({ where: { id: prasodhita.id }, data: { parentId: aalu.id } });

  console.log('Hierarchy fixed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
