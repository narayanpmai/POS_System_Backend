import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
    if (role?.name === 'Super Admin' && reqUser.role.name !== 'Super Admin') {
      throw new BadRequestException('Only Super Admin can create a Super Admin');
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

  async update(reqUser: any, id: number, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (reqUser.role.name !== 'Super Admin' && user.companyId !== reqUser.companyId) {
      throw new BadRequestException('Cannot update user from another company');
    }

    if (data.roleId) {
      const role = await this.prisma.role.findUnique({ where: { id: data.roleId } });
      if (role?.name === 'Super Admin' && reqUser.role.name !== 'Super Admin') {
        throw new BadRequestException('Only Super Admin can assign Super Admin role');
      }
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
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
    return { message: 'Password reset successfully' };
  }
}
