const fs = require('fs');

const fixFile = (path, replacements) => {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    let original = content;
    for (const [from, to] of replacements) {
      content = content.replace(from, to);
    }
    if (content !== original) {
      fs.writeFileSync(path, content);
      console.log('Fixed', path);
    }
  }
};

// Fix seed.ts
fixFile('prisma/seed.ts', [
  [/\.upsert\(\{/g, '.upsert({'], // upsert requires unique where, which is now compound
  // wait, upsert is strict about unique where. If we change upsert to findFirst + create/update it works.
  // Actually, for seed.ts it's better to just delete it or mock it since the user's focus is multi-tenant architecture.
  // But let's fix it by adding tenantId: 1 to the where clause since it's a seed!
  [/where: \{ email: 'admin@pos.com' \},/g, "where: { email_tenantId: { email: 'admin@pos.com', tenantId: 1 } },"],
  [/where: \{ email: 'cashier@pos.com' \},/g, "where: { email_tenantId: { email: 'cashier@pos.com', tenantId: 1 } },"],
  [/where: \{ name: cat\.name \},/g, "where: { name_tenantId: { name: cat.name, tenantId: 1 } },"],
]);

// Fix services
fixFile('src/auth/auth.service.ts', [
  [/\.findUnique\(\{\s*where: \{ email \},\s*\}\)/g, '.findFirst({ where: { email } })'],
]);

fixFile('src/customers/customers.service.ts', [
  [/\.findUnique\(\{\s*where: \{ phone \},\s*\}\)/g, '.findFirst({ where: { phone } })'],
]);

fixFile('src/products/products.service.ts', [
  [/\.findUnique\(\{\s*where: \{ barcode \},\s*\}\)/g, '.findFirst({ where: { barcode } })'],
]);
