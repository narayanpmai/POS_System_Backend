import os

schema_path = 'd:/Project/KoseliGhar_POS/koselighar-backend/backend/prisma/schema.prisma'
with open(schema_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add UnitConversion model at the end
unit_conversion_model = """
// =========================
// UNIT CONVERSION MODULE
// =========================

model UnitConversion {
  id               Int      @id @default(autoincrement())
  baseUnit         String   // e.g., "KG", "Dozen", "Box"
  secondaryUnit    String   // e.g., "Gram", "Piece"
  conversionFactor Float    // e.g., 1000 (1 Base = 1000 Secondary)
  
  productId        Int?     
  product          Product? @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  companyId        Int      @default(1)
  company          Company  @relation(fields: [companyId], references: [id])
}
"""

if 'model UnitConversion' not in content:
    content += unit_conversion_model

# 2. Add UnitConversions to Product model
product_insert = """  company               Company                @relation(fields: [companyId], references: [id])
  unitConversions       UnitConversion[]"""
content = content.replace('  company               Company                @relation(fields: [companyId], references: [id])', product_insert, 1)

# 3. Add UnitConversions to Company model
company_insert = """  PaymentTransaction    PaymentTransaction[]
  unitConversions       UnitConversion[]"""
content = content.replace('  PaymentTransaction    PaymentTransaction[]', company_insert, 1)

# 4. Modify SaleItem
sale_item_insert = """  total           Float
  saleUnit        String?  // e.g., "Gram"
  saleUnitQuantity Float?  // e.g., 250"""
content = content.replace('  total           Float', sale_item_insert, 1)

# 5. Modify PurchaseItem
purchase_item_insert = """  total               Float
  saleUnit            String?
  saleUnitQuantity    Float?"""
content = content.replace('  total               Float', purchase_item_insert, 1)

with open(schema_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Schema updated.')
