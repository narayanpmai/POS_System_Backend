const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCompany12Data() {
  console.log('🚀 Starting Seeding for Company ID 12...');

  // 1. Ensure Company ID 12 exists
  let company = await prisma.company.findUnique({ where: { id: 12 } });
  if (!company) {
    console.log('Company ID 12 not found. Creating Company 12...');
    company = await prisma.company.create({
      data: {
        id: 12,
        name: 'KoseliGhar Retail Nepal',
        email: 'info@koselighar.com.np',
        phone: '9801234567',
        address: 'Kathmandu, Nepal',
        isActive: true,
      },
    });
  }
  console.log(`✅ Using Company: [${company.id}] ${company.name}`);

  // 2. Define 45 Authentic Nepali Brands
  const nepaliBrands = [
    { name: 'Wai Wai', slug: 'wai-wai' },
    { name: 'Goldstar', slug: 'goldstar' },
    { name: 'CG Foods', slug: 'cg-foods' },
    { name: 'Nebico', slug: 'nebico' },
    { name: 'DDC (Dairy Development Corp)', slug: 'ddc' },
    { name: 'Panchakanya', slug: 'panchakanya' },
    { name: 'Hulas', slug: 'hulas' },
    { name: 'Century Spices', slug: 'century-spices' },
    { name: 'Current Noodles', slug: 'current-noodles' },
    { name: 'Tokla Tea', slug: 'tokla-tea' },
    { name: 'Shikhar Shoes', slug: 'shikhar-shoes' },
    { name: 'Caliber Shoes', slug: 'caliber-shoes' },
    { name: 'Sujal Foods (Chocofun)', slug: 'sujal-foods' },
    { name: 'Yasoda Foods', slug: 'yasoda-foods' },
    { name: 'Kanchanjunga Tea', slug: 'kanchanjunga-tea' },
    { name: 'Himalayan Java', slug: 'himalayan-java' },
    { name: 'Dabur Nepal', slug: 'dabur-nepal' },
    { name: 'Unilever Nepal', slug: 'unilever-nepal' },
    { name: 'Salt Trading Corp', slug: 'salt-trading-corp' },
    { name: 'Sitaram Milk', slug: 'sitaram-milk' },
    { name: 'Khukri Rum', slug: 'khukri-rum' },
    { name: 'Old Durbar', slug: 'old-durbar' },
    { name: 'Gorkha Brewery', slug: 'gorkha-brewery' },
    { name: 'Mustang Beer', slug: 'mustang-beer' },
    { name: 'Ruslan Vodka', slug: 'ruslan-vodka' },
    { name: 'Haldiram Nepal', slug: 'haldiram-nepal' },
    { name: 'Patanjali Nepal', slug: 'patanjali-nepal' },
    { name: 'Annapurna Salt', slug: 'annapurna-salt' },
    { name: 'Megha Spices', slug: 'megha-spices' },
    { name: 'Sujal Dairy (Safal)', slug: 'sujal-dairy' },
    { name: 'Asian Paints Nepal', slug: 'asian-paints-nepal' },
    { name: 'Nepal Oil Corp', slug: 'nepal-oil-corp' },
    { name: 'Kanti Ghee', slug: 'kanti-ghee' },
    { name: 'Gautam Rice', slug: 'gautam-rice' },
    { name: 'Bhakti Rice', slug: 'bhakti-rice' },
    { name: 'Pokhara Noodle', slug: 'pokhara-noodle' },
    { name: 'Rara Noodle', slug: 'rara-noodle' },
    { name: '2PM Noodle', slug: '2pm-noodle' },
    { name: 'Rum Pum Noodle', slug: 'rum-pum-noodle' },
    { name: 'Preeti Noodle', slug: 'preeti-noodle' },
    { name: 'Nepal Bakery', slug: 'nepal-bakery' },
    { name: 'Kedia Rice', slug: 'kedia-rice' },
    { name: 'Gorkha Tea', slug: 'gorkha-tea' },
    { name: 'Illam Tea', slug: 'illam-tea' },
    { name: 'Kathmandu Dairy', slug: 'kathmandu-dairy' },
  ];

  console.log(`📦 Upserting ${nepaliBrands.length} Nepali Brands...`);
  const createdBrandsMap = {};
  for (const b of nepaliBrands) {
    const brand = await prisma.brand.upsert({
      where: { name_companyId: { name: b.name, companyId: 12 } },
      update: { status: 'ACTIVE' },
      create: {
        name: b.name,
        slug: `${b.slug}-c12`,
        status: 'ACTIVE',
        companyId: 12,
      },
    });
    createdBrandsMap[b.name] = brand.id;
  }
  console.log(`✅ ${Object.keys(createdBrandsMap).length} Brands created/verified.`);

  // 3. Define Main Categories and Subcategories
  console.log('📂 Creating Categories and Subcategories...');
  const categoryStructure = [
    {
      name: 'खाद्यान्न तथा किराना (Groceries & Staples)',
      description: 'नेपाली भान्साका आधारभूत खाद्यान्न सामाग्रीहरू',
      children: [
        { name: 'चामल तथा दाल (Rice & Pulses)', description: 'मन्सुली, जिरा मसिना, कालो दाल, रहर दाल' },
        { name: 'तेल तथा घ्यु (Oils & Ghee)', description: 'तोरीको तेल, सुर्यमुखी तेल, शुद्ध गाई/चौरी घ्यु' },
        { name: 'मसला तथा नुन (Spices & Salt)', description: 'बेसार, जिरा, धनियाँ, आयो नुन, गरम मसला' },
      ],
    },
    {
      name: 'चाउचाउ तथा खाजा (Noodles & Snacks)',
      description: 'तयारी चाउचाउ, भुजिया, बिस्कुट तथा खाजा सामाग्री',
      children: [
        { name: 'चाउचाउ (Instant Noodles)', description: 'वाई वाई, करेन्ट, २० पीएम, रारा चाउचाउ' },
        { name: 'बिस्कुट तथा चकलेट (Biscuits & Chocolates)', description: 'नेबिको डाइजेस्टिभ, चकलेट, कुकिज' },
        { name: 'भुजिया तथा दालमोठ (Namkeen & Bhujia)', description: 'आलु भुजिया, दालमोठ, मिक्स नमकिन' },
      ],
    },
    {
      name: 'पेय पदार्थ (Beverages)',
      description: 'चिया, कफी, जुस तथा सफ्ट ड्रिंक्स',
      children: [
        { name: 'चिया तथा कफी (Tea & Coffee)', description: 'इलाम चिया, तोक्ला, हिमालयन जाभा कफी' },
        { name: 'जुस तथा पेय (Juices & Soft Drinks)', description: 'रियल जुस, फ्रुटी, रोयल डिलाइट' },
        { name: 'रक्सी तथा बियर (Liquor & Beer)', description: 'खुकुरी रम, ओल्ड दरबार, गोर्खा बियर' },
      ],
    },
    {
      name: 'डेयरी उत्पादन (Dairy Products)',
      description: 'ताजा दुध, दही, मोही, पनिर र छुर्पी',
      children: [
        { name: 'दुध तथा दही (Milk & Curd)', description: 'पास्चराइज्ड दुध, मीठो दही, मोही' },
        { name: 'नौनी तथा पनिर (Butter & Cottage Cheese)', description: 'नौनी घ्यु, ताजा पनिर, छुर्पी' },
      ],
    },
    {
      name: 'जुत्ता तथा पहिरन (Footwear & Apparel)',
      description: 'स्वदेशी गोल्डस्टार तथा शिखर जुत्ता-चप्पल',
      children: [
        { name: 'गोल्डस्टार जुत्ता (Goldstar Shoes)', description: 'स्पोर्ट्स, क्याजुअल, स्कुल जुत्ता' },
        { name: 'शिखर तथा क्यालिबर जुत्ता (Shikhar & Caliber)', description: 'लेदर, ट्रेकिङ तथा क्याजुअल जुत्ता' },
      ],
    },
    {
      name: 'घरायसी तथा सरसफाइ (Household & Hygiene)',
      description: 'साबुन, मन्जन, सरसफाइ सामाग्री',
      children: [
        { name: 'सरसफाइ (Cleaning & Hygiene)', description: 'साबुन, मन्जन, स्याम्पू' },
      ],
    },
  ];

  const categoryMap = {}; // name -> id

  for (const parentCat of categoryStructure) {
    const parent = await prisma.category.upsert({
      where: { name_companyId: { name: parentCat.name, companyId: 12 } },
      update: { description: parentCat.description },
      create: {
        name: parentCat.name,
        description: parentCat.description,
        companyId: 12,
      },
    });
    categoryMap[parentCat.name] = parent.id;

    for (const subCat of parentCat.children) {
      const child = await prisma.category.upsert({
        where: { name_companyId: { name: subCat.name, companyId: 12 } },
        update: { description: subCat.description, parentId: parent.id },
        create: {
          name: subCat.name,
          description: subCat.description,
          parentId: parent.id,
          companyId: 12,
        },
      });
      categoryMap[subCat.name] = child.id;
    }
  }
  console.log(`✅ ${Object.keys(categoryMap).length} Categories and Subcategories created/verified.`);

  // 4. Insert 45 Authentic Nepali Products
  console.log('🛍️ Inserting 45 Authentic Nepali Products...');

  const productsList = [
    // Groceries
    { name: 'गौतम जिरा मसिना चामल २५ केजी (Gautam Jeera Masino Rice 25kg)', SKU: 'KG-12-RIC-001', price: 2350, cost: 2100, stock: 150, unit: 'bag', category: 'चामल तथा दाल (Rice & Pulses)', brand: 'Gautam Rice' },
    { name: 'भक्ति प्रिमियम मन्सुली चामल २५ केजी (Bhakti Mansuli Rice 25kg)', SKU: 'KG-12-RIC-002', price: 1950, cost: 1750, stock: 120, unit: 'bag', category: 'चामल तथा दाल (Rice & Pulses)', brand: 'Bhakti Rice' },
    { name: 'नेपाल शुद्ध कालो दाल १ केजी (Nepal Black Lentils 1kg)', SKU: 'KG-12-PUL-003', price: 210, cost: 180, stock: 300, unit: 'kg', category: 'चामल तथा दाल (Rice & Pulses)', brand: 'Salt Trading Corp' },
    { name: 'नेपाल रातो रहर दाल १ केजी (Red Rahar Dal 1kg)', SKU: 'KG-12-PUL-004', price: 240, cost: 210, stock: 250, unit: 'kg', category: 'चामल तथा दाल (Rice & Pulses)', brand: 'Salt Trading Corp' },
    { name: 'कान्ती शुद्ध तोरीको तेल ५ लिटर (Kanti Mustard Oil 5L Jar)', SKU: 'KG-12-OIL-005', price: 1350, cost: 1180, stock: 80, unit: 'jar', category: 'तेल तथा घ्यु (Oils & Ghee)', brand: 'Kanti Ghee' },
    { name: 'नेपाल धारा तोरीको तेल १ लिटर (Dhara Mustard Oil 1L)', SKU: 'KG-12-OIL-006', price: 260, cost: 230, stock: 200, unit: 'pouch', category: 'तेल तथा घ्यु (Oils & Ghee)', brand: 'Salt Trading Corp' },
    { name: 'DDC शुद्ध गाईको घ्यु ५०० ग्राम (DDC Pure Cow Ghee 500g)', SKU: 'KG-12-GHE-007', price: 650, cost: 580, stock: 100, unit: 'jar', category: 'तेल तथा घ्यु (Oils & Ghee)', brand: 'DDC (Dairy Development Corp)' },
    { name: 'हिमालयन चौरीको घ्यु ५०० ग्राम (Himalayan Chauri Ghee 500g)', SKU: 'KG-12-GHE-008', price: 850, cost: 740, stock: 60, unit: 'jar', category: 'तेल तथा घ्यु (Oils & Ghee)', brand: 'DDC (Dairy Development Corp)' },
    { name: 'सेन्चुरी शुद्ध बेसार धुलो २०० ग्राम (Century Turmeric Powder 200g)', SKU: 'KG-12-SPI-009', price: 95, cost: 75, stock: 400, unit: 'packet', category: 'मसला तथा नुन (Spices & Salt)', brand: 'Century Spices' },
    { name: 'सेन्चुरी जिरा धुलो २०० ग्राम (Century Cumin Powder 200g)', SKU: 'KG-12-SPI-010', price: 180, cost: 150, stock: 350, unit: 'packet', category: 'मसला तथा नुन (Spices & Salt)', brand: 'Century Spices' },
    { name: 'मेघा मिट मञ्चुरी मसला १०० ग्राम (Megha Meat Masala 100g)', SKU: 'KG-12-SPI-011', price: 75, cost: 58, stock: 300, unit: 'packet', category: 'मसला तथा नुन (Spices & Salt)', brand: 'Megha Spices' },
    { name: 'साल्ट ट्रेडिङ आयो नुन १ केजी (Aayo Nun Salt 1kg)', SKU: 'KG-12-SLT-012', price: 26, cost: 22, stock: 1000, unit: 'packet', category: 'मसला तथा नुन (Spices & Salt)', brand: 'Salt Trading Corp' },
    { name: 'अन्नपूर्णा शुद्ध नुन १ केजी (Annapurna Salt 1kg)', SKU: 'KG-12-SLT-013', price: 25, cost: 21, stock: 800, unit: 'packet', category: 'मसला तथा नुन (Spices & Salt)', brand: 'Annapurna Salt' },

    // Noodles & Snacks
    { name: 'वाई वाई चिकेन चाउचाउ (Wai Wai Chicken Noodle 75g Box of 30)', SKU: 'KG-12-NOD-012', price: 600, cost: 520, stock: 200, unit: 'box', category: 'चाउचाउ (Instant Noodles)', brand: 'Wai Wai' },
    { name: 'वाई वाई भेजिटेबल चाउचाउ (Wai Wai Veg Noodle 75g Box of 30)', SKU: 'KG-12-NOD-015', price: 570, cost: 490, stock: 180, unit: 'box', category: 'चाउचाउ (Instant Noodles)', brand: 'Wai Wai' },
    { name: 'करेन्ट पिरो चाउचाउ (Current Extra Spicy Noodles 100g Box of 30)', SKU: 'KG-12-NOD-016', price: 1500, cost: 1300, stock: 150, unit: 'box', category: 'चाउचाउ (Instant Noodles)', brand: 'Current Noodles' },
    { name: '२० पीएम चाउचाउ (2PM Spicy Noodle Box of 30)', SKU: 'KG-12-NOD-017', price: 1350, cost: 1150, stock: 100, unit: 'box', category: 'चाउचाउ (Instant Noodles)', brand: '2PM Noodle' },
    { name: 'रारा सेतो चाउचाउ (Rara White Noodle 75g Single)', SKU: 'KG-12-NOD-018', price: 25, cost: 20, stock: 500, unit: 'pcs', category: 'चाउचाउ (Instant Noodles)', brand: 'Rara Noodle' },
    { name: 'रुम पम्प चाउचाउ (Rum Pum Chowchow 75g)', SKU: 'KG-12-NOD-019', price: 20, cost: 16, stock: 450, unit: 'pcs', category: 'चाउचाउ (Instant Noodles)', brand: 'Rum Pum Noodle' },
    { name: 'नेबिको डाइजेस्टिभ बिस्कुट २५० ग्राम (Nebico Digestive Biscuit 250g)', SKU: 'KG-12-BIS-020', price: 110, cost: 90, stock: 300, unit: 'packet', category: 'बिस्कुट तथा चकलेट (Biscuits & Chocolates)', brand: 'Nebico' },
    { name: 'नेबिको ग्लुकोज बिस्कुट (Nebico Glucose Biscuit 100g)', SKU: 'KG-12-BIS-021', price: 20, cost: 15, stock: 600, unit: 'packet', category: 'बिस्कुट तथा चकलेट (Biscuits & Chocolates)', brand: 'Nebico' },
    { name: 'चोको फन चकलेट वेफर (Sujal Chocofun Box of 40)', SKU: 'KG-12-CHO-022', price: 400, cost: 320, stock: 150, unit: 'box', category: 'बिस्कुट तथा चकलेट (Biscuits & Chocolates)', brand: 'Sujal Foods (Chocofun)' },
    { name: 'सेन्चुरी आलु भुजिया ४०० ग्राम (Century Aloo Bhujia 400g)', SKU: 'KG-12-SNK-023', price: 190, cost: 155, stock: 250, unit: 'packet', category: 'भुजिया तथा दालमोठ (Namkeen & Bhujia)', brand: 'Century Spices' },
    { name: 'हल्दीराम शाही मिक्स्चर नमकिन २०० ग्राम (Haldiram Shahi Mixture 200g)', SKU: 'KG-12-SNK-024', price: 120, cost: 115, stock: 200, unit: 'packet', category: 'भुजिया तथा दालमोठ (Namkeen & Bhujia)', brand: 'Haldiram Nepal' },

    // Beverages
    { name: 'इलाम प्रिमियम अर्गानिक कालो चिया ५०० ग्राम (Illam Organic Black Tea 500g)', SKU: 'KG-12-TEA-025', price: 550, cost: 440, stock: 120, unit: 'packet', category: 'चिया तथा कफी (Tea & Coffee)', brand: 'Illam Tea' },
    { name: 'तोक्ला पत्ती चिया ५०० ग्राम (Tokla Leaf Tea 500g)', SKU: 'KG-12-TEA-026', price: 320, cost: 265, stock: 200, unit: 'packet', category: 'चिया तथा कफी (Tea & Coffee)', brand: 'Tokla Tea' },
    { name: 'कञ्चनजङ्घा सिटिओपी चिया ५०० ग्राम (Kanchanjunga CTC Tea 500g)', SKU: 'KG-12-TEA-027', price: 280, cost: 225, stock: 180, unit: 'packet', category: 'चिया तथा कफी (Tea & Coffee)', brand: 'Kanchanjunga Tea' },
    { name: 'हिमालयन जाभा रोस्टेड कफी बीन्स ५०० ग्राम (Himalayan Java Coffee Beans 500g)', SKU: 'KG-12-COF-028', price: 1250, cost: 1200, stock: 50, unit: 'packet', category: 'चिया तथा कफी (Tea & Coffee)', brand: 'Himalayan Java' },
    { name: 'डाबर रियल एम्पल जुस १ लिटर (Dabur Real Apple Juice 1L)', SKU: 'KG-12-JUC-029', price: 260, cost: 220, stock: 150, unit: 'carton', category: 'जुस तथा पेय (Juices & Soft Drinks)', brand: 'Dabur Nepal' },
    { name: 'डाबर रियल म्याङ्गो जुस १ लिटर (Dabur Real Mango Juice 1L)', SKU: 'KG-12-JUC-030', price: 260, cost: 220, stock: 120, unit: 'carton', category: 'जुस तथा पेय (Juices & Soft Drinks)', brand: 'Dabur Nepal' },
    { name: 'खुकुरी ट्रिप्ड रम ७५० मिलि (Khukri XXX Rum 750ml)', SKU: 'KG-12-ALC-031', price: 1850, cost: 1600, stock: 90, unit: 'bottle', category: 'रक्सी तथा बियर (Liquor & Beer)', brand: 'Khukri Rum' },
    { name: 'ओल्ड दरबार ब्ल्याक चिम्नी ७५० मिलि (Old Durbar Black Chimney 750ml)', SKU: 'KG-12-ALC-032', price: 3400, cost: 2950, stock: 60, unit: 'bottle', category: 'रक्सी तथा बियर (Liquor & Beer)', brand: 'Old Durbar' },
    { name: 'गोर्खा प्रिमियम बियर ६५० मिलि (Gorkha Premium Beer 650ml)', SKU: 'KG-12-BER-033', price: 340, cost: 285, stock: 240, unit: 'bottle', category: 'रक्सी तथा बियर (Liquor & Beer)', brand: 'Gorkha Brewery' },
    { name: 'मुस्ताङ क्राफ्ट बियर ६५० मिलि (Mustang Craft Beer 650ml)', SKU: 'KG-12-BER-034', price: 380, cost: 315, stock: 180, unit: 'bottle', category: 'रक्सी तथा बियर (Liquor & Beer)', brand: 'Mustang Beer' },
    { name: 'रुस्लान ट्रिपल डिस्टिल्ड भोड्का ७५० मिलि (Ruslan Vodka 750ml)', SKU: 'KG-12-ALC-035', price: 1750, cost: 1500, stock: 80, unit: 'bottle', category: 'रक्सी तथा बियर (Liquor & Beer)', brand: 'Ruslan Vodka' },

    // Dairy
    { name: 'DDC ताजा स्ट्यान्डर्ड दुध ५०० मिलि (DDC Standard Milk 500ml)', SKU: 'KG-12-MLK-036', price: 50, cost: 45, stock: 500, unit: 'pouch', category: 'दुध तथा दही (Milk & Curd)', brand: 'DDC (Dairy Development Corp)' },
    { name: 'सीताराम मीठो दही ५०० ग्राम (Sitaram Sweet Curd 500g)', SKU: 'KG-12-CRD-037', price: 95, cost: 80, stock: 200, unit: 'cup', category: 'दुध तथा दही (Milk & Curd)', brand: 'Sitaram Milk' },
    { name: 'DDC ताजा पनिर ५०० ग्राम (DDC Fresh Paneer 500g)', SKU: 'KG-12-PNR-038', price: 420, cost: 360, stock: 80, unit: 'packet', category: 'नौनी तथा पनिर (Butter & Cottage Cheese)', brand: 'DDC (Dairy Development Corp)' },
    { name: 'हिमालयन कडा छुर्पी १०० ग्राम (Himalayan Hard Churpi Dog/Human Chew 100g)', SKU: 'KG-12-CHP-039', price: 180, cost: 130, stock: 300, unit: 'pcs', category: 'नौनी तथा पनिर (Butter & Cottage Cheese)', brand: 'Kathmandu Dairy' },

    // Footwear
    { name: 'गोल्डस्टार रनर स्पोर्ट्स जुत्ता (Goldstar Runner Sports Shoes Black/Red Size 41)', SKU: 'KG-12-SHO-040', price: 1250, cost: 1150, stock: 40, unit: 'pair', category: 'गोल्डस्टार जुत्ता (Goldstar Shoes)', brand: 'Goldstar' },
    { name: 'गोल्डस्टार क्लासिक सेतो स्कुल जुत्ता (Goldstar Classic White School Shoes Size 38)', SKU: 'KG-12-SHO-041', price: 950, cost: 750, stock: 60, unit: 'pair', category: 'गोल्डस्टार जुत्ता (Goldstar Shoes)', brand: 'Goldstar' },
    { name: 'शिखर क्याजुअल लेदर जुत्ता (Shikhar Casual Genuine Leather Shoes Size 42)', SKU: 'KG-12-SHO-042', price: 3200, cost: 2500, stock: 25, unit: 'pair', category: 'शिखर तथा क्यालिबर जुत्ता (Shikhar & Caliber)', brand: 'Shikhar Shoes' },
    { name: 'क्यालिबर हाइकिङ ट्रेकिङ बुट (Caliber Waterproof Hiking Boot Size 42)', SKU: 'KG-12-SHO-043', price: 4500, cost: 3600, stock: 20, unit: 'pair', category: 'शिखर तथा क्यालिबर जुत्ता (Shikhar & Caliber)', brand: 'Caliber Shoes' },
    { name: 'युनिलिभर लाइफबोय साबुन १२५ ग्राम (Unilever Lifebuoy Soap 125g)', SKU: 'KG-12-SOP-044', price: 55, cost: 44, stock: 400, unit: 'pcs', category: 'सरसफाइ (Cleaning & Hygiene)', brand: 'Unilever Nepal' },
    { name: 'पतञ्जली दन्त कान्ति मन्जन १०० ग्राम (Patanjali Dant Kanti Toothpaste 100g)', SKU: 'KG-12-PST-045', price: 85, cost: 68, stock: 350, unit: 'pcs', category: 'सरसफाइ (Cleaning & Hygiene)', brand: 'Patanjali Nepal' },
  ];

  let insertedCount = 0;
  for (const item of productsList) {
    const categoryId = categoryMap[item.category];
    const brandId = createdBrandsMap[item.brand] || null;

    if (!categoryId) {
      console.warn(`Category not found for product: ${item.name}`);
      continue;
    }

    await prisma.product.upsert({
      where: { SKU_companyId: { SKU: item.SKU, companyId: 12 } },
      update: {
        name: item.name,
        price: item.price,
        cost: item.cost,
        stock: item.stock,
        unit: item.unit,
        categoryId,
        brandId,
      },
      create: {
        name: item.name,
        SKU: item.SKU,
        barcode: item.SKU,
        price: item.price,
        cost: item.cost,
        stock: item.stock,
        minStockAlert: 10,
        unit: item.unit,
        categoryId,
        brandId,
        companyId: 12,
      },
    });
    insertedCount++;
  }

  console.log(`🎉 Successfully inserted/updated ${insertedCount} Products for Company ID 12!`);
}

seedCompany12Data()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
