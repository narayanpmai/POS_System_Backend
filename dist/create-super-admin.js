"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const role = await prisma.role.findFirst({ where: { name: 'Super Admin' } });
    if (!role) {
        console.error('Super Admin role not found!');
        return;
    }
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
        data: {
            name: 'Smart Panchpokhari',
            email: 'smartpanchpokhari@gmail.com',
            password: hashedPassword,
            roleId: role.id,
            companyId: 1,
        }
    });
    console.log('User created:', user.email);
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=create-super-admin.js.map