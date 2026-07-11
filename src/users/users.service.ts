import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' }
    });
    // Strip passwords before returning
    return users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
  }

  async getRoles() {
    return this.prisma.role.findMany();
  }

  async create(data: any) {
    const existing = await this.prisma.user.findFirst({ where: { email: data.email } });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        roleId: data.roleId,
        active: data.active ?? true,
      },
      include: { role: true }
    });
    
    const { password, ...rest } = user;
    return rest;
  }

  async update(id: number, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (data.email && data.email !== user.email) {
      const existing = await this.prisma.user.findFirst({ where: { email: data.email } });
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

  async resetPassword(id: number, data: any) {
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
