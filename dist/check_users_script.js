"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function check() {
    const users = await prisma.user.findMany({ select: { name: true, email: true, role: { select: { name: true } } } });
    console.log(users);
}
check().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=check_users_script.js.map