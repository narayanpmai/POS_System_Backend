const fs = require('fs');

let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Replace `tenantId             Int` with `tenantId             Int @default(1)`
// This makes it optional in Prisma TS client
schema = schema.replace(/tenantId\s+Int(\s*)$/gm, 'tenantId Int @default(1)$1');
schema = schema.replace(/tenantId\s+Int(\s+)@unique/gm, 'tenantId Int @default(1) @unique');

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Updated schema.prisma');
