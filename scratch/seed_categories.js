const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const companyId = 10;

  // 1. Find or create root category खाद्यान्न
  let root = await prisma.category.findFirst({
    where: { name: 'खाद्यान्न', companyId }
  });

  if (!root) {
    root = await prisma.category.create({
      data: {
        name: 'खाद्यान्न',
        description: 'खाद्यान्न सामग्री',
        companyId
      }
    });
    console.log('Created Root Category खाद्यान्न:', root.id);
  } else {
    console.log('Found Root Category खाद्यान्न:', root.id);
  }

  // Helper function to create category if not exists
  async function ensureCat(name, description, parentId) {
    let cat = await prisma.category.findFirst({
      where: { name, companyId }
    });
    if (!cat) {
      cat = await prisma.category.create({
        data: { name, description, parentId, companyId }
      });
      console.log(`Created [L${parentId ? 'Sub' : 'Root'}]: ${name} (ID: ${cat.id}, Parent: ${parentId})`);
    } else {
      if (cat.parentId !== parentId) {
        cat = await prisma.category.update({
          where: { id: cat.id },
          data: { parentId }
        });
        console.log(`Updated Parent for ${name} -> Parent ID: ${parentId}`);
      } else {
        console.log(`Existing: ${name} (ID: ${cat.id})`);
      }
    }
    return cat;
  }

  // --- RICE HIERARCHY ---
  // Level 1: चामल
  const chamal = await ensureCat('चामल', 'विभिन्न प्रकारका चामलहरु', root.id);

  // Level 2 under चामल
  const basmati = await ensureCat('बासमती चामल', 'सुगन्धित लामो दाना भएको चामल', chamal.id);
  const masino = await ensureCat('मसिनो चामल', 'दैनिक प्रयोग हुने मसिनो चामल', chamal.id);
  const moto = await ensureCat('मोटो चामल', 'मोटा दाना भएको चामल', chamal.id);

  // Level 3 under बासमती चामल
  await ensureCat('१ नम्बर बासमती', 'प्रिमियम क्वालिटी बासमती चामल', basmati.id);
  await ensureCat('२ नम्बर बासमती', 'स्ट्यान्डर्ड क्वालिटी बासमती चामल', basmati.id);
  await ensureCat('टुटेको बासमती', 'कनिका / टुटेको बासमती चामल', basmati.id);

  // --- POTATO HIERARCHY ---
  // Level 1: आलु
  const aalu = await ensureCat('आलु', 'विभिन्न प्रकारका आलु तथा आलुजन्य परिकार', root.id);

  // Level 2 under आलु
  const sthaniyaAalu = await ensureCat('स्थानीय आलु', 'नेपाली अर्गानिक स्थानीय आलु', aalu.id);
  const diamondAalu = await ensureCat('डायमण्ड आलु', 'इन्डिया / ठुलो साइजको डायमण्ड आलु', aalu.id);
  const prasodhitaAalu = await ensureCat('प्रशोधित आलु', 'आलुजन्य तयारी तथा प्रसोधित सामग्री', aalu.id);

  // Level 3 under प्रशोधित आलु
  await ensureCat('आलु चिप्स', 'विभिन्न स्वादका आलु चिप्स', prasodhitaAalu.id);
  await ensureCat('आलु पाउडर', 'आलुको धूलो / स्टार्च', prasodhitaAalu.id);
  await ensureCat('फ्रोजन आलु', 'फ्रोजन आलु फिंगर फ्यान', prasodhitaAalu.id);

  console.log('Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
