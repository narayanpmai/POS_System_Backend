const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', (filePath) => {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Change findUnique to findFirst where appropriate
    content = content.replace(/\.findUnique\(\s*\{\s*where:\s*\{\s*email:/g, '.findFirst({ where: { email:');
    content = content.replace(/\.findUnique\(\s*\{\s*where:\s*\{\s*name:/g, '.findFirst({ where: { name:');
    content = content.replace(/\.findUnique\(\s*\{\s*where:\s*\{\s*phone:/g, '.findFirst({ where: { phone:');
    content = content.replace(/\.findUnique\(\s*\{\s*where:\s*\{\s*SKU:/g, '.findFirst({ where: { SKU:');
    content = content.replace(/\.findUnique\(\s*\{\s*where:\s*\{\s*barcode:/g, '.findFirst({ where: { barcode:');
    content = content.replace(/\.findUnique\(\s*\{\s*where:\s*\{\s*poNumber:/g, '.findFirst({ where: { poNumber:');
    content = content.replace(/\.findUnique\(\s*\{\s*where:\s*\{\s*invoiceNo:/g, '.findFirst({ where: { invoiceNo:');

    // For create missing tenantId, a quick fix is casting data to any
    // data: { ... } -> data: { ... } as any
    // But regex for this is tricky. Instead, we can add @default(1) to tenantId in schema.prisma.
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated', filePath);
    }
  }
});
