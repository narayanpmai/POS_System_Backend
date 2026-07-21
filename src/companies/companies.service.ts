import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.company.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(data: { 
    name: string; 
    email?: string; 
    phone?: string; 
    address?: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
  }) {
    // Basic validation
    if (!data.adminEmail || !data.adminPassword) {
      throw new BadRequestException('Admin email and password are required');
    }

    // Note: Email uniqueness is now scoped per company (@@unique([email, companyId]))
    // The transaction's try-catch will handle any conflicts

    // Get Admin role (upsert/create if missing)
    let adminRole = await this.prisma.role.findUnique({
      where: { name: 'Admin' }
    });

    if (!adminRole) {
      adminRole = await this.prisma.role.create({
        data: { name: 'Admin', description: 'Administrator privileges' }
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.adminPassword, salt);

    // Use a transaction to ensure all related records are created together
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // 1. Create the Company
        const company = await prisma.company.create({
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
          },
        });

        // 2. Create the StoreSetting for the Company
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

        // 3. Create the Admin User
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
    } catch (error: any) {
      // Handle Prisma unique constraint violations
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        if (target?.includes('email')) {
          throw new BadRequestException('This email is already registered. Please use a different email.');
        }
        throw new BadRequestException(`A record with this data already exists (${target?.join(', ') || 'unique constraint'}).`);
      }
      throw new BadRequestException(error.message || 'Failed to create company. Please try again.');
    }
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.company.update({
      where: { id },
      data,
    });
  }
}
