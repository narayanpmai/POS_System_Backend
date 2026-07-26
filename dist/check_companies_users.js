"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const companies = await prisma.company.findMany();
    console.log(companies.map(c => ({ id: c.id, name: c.name, storeName: c.storeName })));
    const users = await prisma.user.findMany({
        select: { id: true, email: true, companyId: true, role: { select: { name: true } } }
    });
    console.log("Users counts by company:");
    const counts = {};
    users.forEach(u => {
        counts[u.companyId] = (counts[u.companyId] || 0) + 1;
    });
    console.log(counts);
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=check_companies_users.js.map