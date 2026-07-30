import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(reqUser: any) {
    let where: any = {};
    if (reqUser.role.name !== 'Super Admin') {
      where.companyId = reqUser.companyId;
    }

    const users = await this.prisma.user.findMany({
      where,
      include: { role: true, company: true },
      orderBy: { createdAt: 'desc' }
    });
    // Strip passwords before returning
    return users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
  }

  async getRoles(reqUser: any) {
    let where: any = {};
    if (reqUser.role.name !== 'Super Admin') {
      where.name = { not: 'Super Admin' };
    }
    return this.prisma.role.findMany({ where });
  }

  async create(reqUser: any, data: any) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const role = await this.prisma.role.findUnique({ where: { id: data.roleId } });
    if (!role) throw new BadRequestException('Role not found');

    const targetCompanyId = (reqUser.role.name === 'Super Admin' && data.companyId)
      ? Number(data.companyId)
      : reqUser.companyId;

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        roleId: data.roleId,
        companyId: targetCompanyId,
        active: true,
      },
      include: { role: true, company: true }
    });

    const { password, ...rest } = user;
    return rest;
  }

  async update(reqUser: any, id: number, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (reqUser.role.name !== 'Super Admin' && user.companyId !== reqUser.companyId) {
      throw new BadRequestException('Cannot update user from another company');
    }

    if (data.email && data.email !== user.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
      if (existing) throw new BadRequestException('Email already in use');
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      roleId: data.roleId,
      active: data.active
    };

    if (reqUser.role.name === 'Super Admin' && data.companyId !== undefined && data.companyId !== null) {
      updateData.companyId = Number(data.companyId);
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true, company: true }
    });

    const { password, ...rest } = updated;
    return rest;
  }

  async resetPassword(reqUser: any, id: number, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    
    if (reqUser.role.name !== 'Super Admin' && user.companyId !== reqUser.companyId) {
      throw new BadRequestException('Cannot update user from another company');
    }

    if (!data.newPassword) {
      throw new BadRequestException('New password is required');
    }
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword, active: true }
    });
    return { message: `Password reset successfully for ${updatedUser.email}` };
  }

  async remove(reqUser: any, id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!user) throw new NotFoundException('User not found');

    if (id === reqUser.id) {
      throw new BadRequestException('You cannot delete your logged-in account');
    }

    if (reqUser.role.name !== 'Super Admin' && user.companyId !== reqUser.companyId) {
      throw new BadRequestException('Cannot delete user from another company');
    }

    if (user.role.name === 'Super Admin' && reqUser.role.name !== 'Super Admin') {
      throw new BadRequestException('Only Super Admin can delete a Super Admin account');
    }

    return this.prisma.$transaction(async (prisma) => {
      // Find a fallback user in the same company to reassign created transactions
      const fallbackUser = await prisma.user.findFirst({
        where: { companyId: user.companyId, NOT: { id } },
      }) || await prisma.user.findFirst({ where: { role: { name: 'Super Admin' } } });

      if (fallbackUser) {
        await prisma.purchase.updateMany({ where: { userId: id }, data: { userId: fallbackUser.id } });
        await prisma.sale.updateMany({ where: { cashierId: id }, data: { cashierId: fallbackUser.id } });
        await prisma.inventoryTransaction.updateMany({ where: { userId: id }, data: { userId: fallbackUser.id } });
      }

      await prisma.activityLog.deleteMany({ where: { userId: id } });

      await prisma.user.delete({ where: { id } });
      return { success: true, message: `User "${user.name}" deleted successfully` };
    });
  }
}
