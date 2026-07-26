"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(reqUser) {
        let where = {};
        if (reqUser.role.name !== 'Super Admin') {
            where.companyId = reqUser.companyId;
            where.role = {
                name: { not: 'Super Admin' }
            };
        }
        const users = await this.prisma.user.findMany({
            where,
            include: { role: true, company: true },
            orderBy: { createdAt: 'desc' }
        });
        return users.map(u => {
            const { password, ...rest } = u;
            return rest;
        });
    }
    async getRoles(reqUser) {
        let where = {};
        if (reqUser.role.name !== 'Super Admin') {
            where.name = { not: 'Super Admin' };
        }
        return this.prisma.role.findMany({ where });
    }
    async create(reqUser, data) {
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new common_1.BadRequestException('Email already in use');
        }
        const role = await this.prisma.role.findUnique({ where: { id: data.roleId } });
        if (role?.name === 'Super Admin' && reqUser.role.name !== 'Super Admin') {
            throw new common_1.BadRequestException('Only Super Admin can create a Super Admin');
        }
        const companyId = (reqUser.role.name === 'Super Admin' && data.companyId)
            ? data.companyId
            : reqUser.companyId;
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                roleId: data.roleId,
                active: data.active ?? true,
                companyId,
            },
            include: { role: true }
        });
        const { password, ...rest } = user;
        return rest;
    }
    async update(reqUser, id, data) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (reqUser.role.name !== 'Super Admin' && user.companyId !== reqUser.companyId) {
            throw new common_1.BadRequestException('Cannot update user from another company');
        }
        if (data.roleId) {
            const role = await this.prisma.role.findUnique({ where: { id: data.roleId } });
            if (role?.name === 'Super Admin' && reqUser.role.name !== 'Super Admin') {
                throw new common_1.BadRequestException('Only Super Admin can assign Super Admin role');
            }
        }
        if (data.email && data.email !== user.email) {
            const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
            if (existing)
                throw new common_1.BadRequestException('Email already in use');
        }
        const updateData = {
            name: data.name,
            email: data.email,
            roleId: data.roleId,
            active: data.active
        };
        if (reqUser.role.name === 'Super Admin' && data.companyId !== undefined) {
            updateData.companyId = Number(data.companyId);
        }
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        const updated = await this.prisma.user.update({
            where: { id },
            data: updateData,
            include: { role: true }
        });
        const { password, ...rest } = updated;
        return rest;
    }
    async remove(reqUser, id) {
        const user = await this.prisma.user.findUnique({ where: { id }, include: { role: true } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (reqUser.role.name !== 'Super Admin' && user.companyId !== reqUser.companyId) {
            throw new common_1.BadRequestException('Cannot delete user from another company');
        }
        if (user.role.name === 'Super Admin' && reqUser.role.name !== 'Super Admin') {
            throw new common_1.BadRequestException('Only Super Admin can delete a Super Admin');
        }
        if (user.id === reqUser.id) {
            throw new common_1.BadRequestException('Cannot delete your own account');
        }
        try {
            await this.prisma.user.delete({ where: { id } });
            return { message: 'User deleted successfully' };
        }
        catch (err) {
            throw new common_1.BadRequestException('Cannot delete user because they have associated records (e.g., sales). Consider deactivating the account instead.');
        }
    }
    async resetPassword(reqUser, id, data) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (reqUser.role.name !== 'Super Admin' && user.companyId !== reqUser.companyId) {
            throw new common_1.BadRequestException('Cannot update user from another company');
        }
        if (!data.newPassword) {
            throw new common_1.BadRequestException('New password is required');
        }
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        await this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });
        return { message: 'Password reset successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map