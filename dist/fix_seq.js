"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.$executeRawUnsafe(`SELECT setval('"Company_id_seq"', COALESCE((SELECT MAX(id) FROM "Company"), 1), true)`);
    await prisma.$executeRawUnsafe(`SELECT setval('"User_id_seq"', COALESCE((SELECT MAX(id) FROM "User"), 1), true)`);
    await prisma.$executeRawUnsafe(`SELECT setval('"StoreSetting_id_seq"', COALESCE((SELECT MAX(id) FROM "StoreSetting"), 1), true)`);
    await prisma.$executeRawUnsafe(`SELECT setval('"Role_id_seq"', COALESCE((SELECT MAX(id) FROM "Role"), 1), true)`);
    await prisma.$executeRawUnsafe(`SELECT setval('"Category_id_seq"', COALESCE((SELECT MAX(id) FROM "Category"), 1), true)`);
    await prisma.$executeRawUnsafe(`SELECT setval('"ExpenseCategory_id_seq"', COALESCE((SELECT MAX(id) FROM "ExpenseCategory"), 1), true)`);
    await prisma.$executeRawUnsafe(`SELECT setval('"IncomeCategory_id_seq"', COALESCE((SELECT MAX(id) FROM "IncomeCategory"), 1), true)`);
    await prisma.$executeRawUnsafe(`SELECT setval('"ChartOfAccount_id_seq"', COALESCE((SELECT MAX(id) FROM "ChartOfAccount"), 1), true)`);
    await prisma.$executeRawUnsafe(`SELECT setval('"MembershipTier_id_seq"', COALESCE((SELECT MAX(id) FROM "MembershipTier"), 1), true)`);
    console.log('Sequences fixed.');
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=fix_seq.js.map