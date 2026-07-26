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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let CompaniesService = class CompaniesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        return this.prisma.company.findMany({
            where,
            orderBy: { id: 'asc' },
        });
    }
    async findOne(id) {
        const company = await this.prisma.company.findUnique({
            where: { id },
        });
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        return company;
    }
    async create(data) {
        if (!data.adminEmail || !data.adminPassword) {
            throw new common_1.BadRequestException('Admin email and password are required');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.adminEmail }
        });
        if (existingUser) {
            throw new common_1.BadRequestException('A user with this admin email already exists.');
        }
        const adminRole = await this.prisma.role.findUnique({
            where: { name: 'Admin' }
        });
        if (!adminRole) {
            throw new common_1.BadRequestException('Admin role not found in the system');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.adminPassword, salt);
        return this.prisma.$transaction(async (prisma) => {
            const company = await prisma.company.create({
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                },
            });
            await prisma.storeSetting.create({
                data: {
                    companyId: company.id,
                    storeName: company.name,
                    address: company.address || '',
                    phone: company.phone || '',
                    email: company.email || '',
                    currencySymbol: 'Rs.',
                },
            });
            await prisma.user.create({
                data: {
                    email: data.adminEmail,
                    password: hashedPassword,
                    name: data.adminName || 'Admin User',
                    roleId: adminRole.id,
                    companyId: company.id,
                    active: true,
                },
            });
            return company;
        });
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.company.update({
            where: { id },
            data,
        });
    }
    async deleteCompany(id) {
        if (id === 1) {
            throw new common_1.BadRequestException('Cannot delete or deactivate the Super Admin (default) company.');
        }
        const company = await this.prisma.company.findUnique({ where: { id } });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        await this.prisma.company.update({
            where: { id },
            data: { isActive: false }
        });
        await this.prisma.user.updateMany({
            where: { companyId: id },
            data: { active: false }
        });
        return { success: true, message: 'Company deactivated successfully. No data was permanently deleted.' };
    }
    async deleteCompanyPermanently(id) {
        if (id === 1) {
            throw new common_1.BadRequestException('Cannot permanently delete the default KoseliGhar company.');
        }
        await this.prisma.user.deleteMany({ where: { companyId: id } });
        await this.prisma.fiscalYear.deleteMany({ where: { companyId: id } });
        await this.prisma.company.delete({ where: { id } });
        return { success: true, message: 'Company permanently deleted from database.' };
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map