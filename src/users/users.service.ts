import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      throw new BadRequestException('Name, email, and password are required');
    }
    if (!data.roleId) {
      throw new BadRequestException('Role is required');
    }

    // Validate that the role exists
    const role = await this.prisma.role.findUnique({ where: { id: Number(data.roleId) } });
    if (!role) {
      throw new BadRequestException(`Role with ID ${data.roleId} does not exist. Please select a valid role.`);
    }

    // Check if email is already in use
    const existing = await this.prisma.user.findFirst({ where: { email: data.email } });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          roleId: Number(data.roleId),
          active: data.active ?? true,
        },
        include: { role: true }
      });
      
      const { password, ...rest } = user;
      return rest;
    } catch (err: any) {
      if (err.code === 'P2003') {
        throw new BadRequestException('Invalid role selected. Please choose a valid role.');
      }
      if (err.code === 'P2002') {
        throw new BadRequestException('A user with this email already exists.');
      }
      throw new InternalServerErrorException('Failed to create user: ' + (err.message || 'Unknown error'));
    }
  }

  async update(id: number, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (data.email && data.email !== user.email) {
      const existing = await this.prisma.user.findFirst({ where: { email: data.email } });
      if (existing) throw new BadRequestException('Email already in use');
    }

    // Validate roleId if provided
    if (data.roleId) {
      const role = await this.prisma.role.findUnique({ where: { id: Number(data.roleId) } });
      if (!role) {
        throw new BadRequestException(`Role with ID ${data.roleId} does not exist.`);
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.roleId !== undefined) updateData.roleId = Number(data.roleId);
    if (data.active !== undefined) updateData.active = data.active;

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    try {
      const updated = await this.prisma.user.update({
        where: { id },
        data: updateData,
        include: { role: true }
      });

      const { password, ...rest } = updated;
      return rest;
    } catch (err: any) {
      if (err.code === 'P2003') {
        throw new BadRequestException('Invalid role selected.');
      }
      if (err.code === 'P2002') {
        throw new BadRequestException('A user with this email already exists.');
      }
      throw new InternalServerErrorException('Failed to update user: ' + (err.message || 'Unknown error'));
    }
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
