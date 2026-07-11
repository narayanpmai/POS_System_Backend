import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({ where: { email: dto.email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.active) {
      throw new UnauthorizedException('Your account has been deactivated');
    }

    const payload = { email: user.email, sub: user.id, role: user.role.name };
    const { password, ...userWithoutPassword } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findFirst({ where: { email: dto.email },
    });

    if (exists) {
      throw new BadRequestException('Email already registered');
    }

    // Assign default role (e.g., Cashier if not specified)
    let role = await this.prisma.role.findFirst({
      where: { name: dto.role || 'Cashier' },
    });

    if (!role) {
      // Fallback
      role = await this.prisma.role.create({
        data: { name: dto.role || 'Cashier', description: 'Default system role' },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        roleId: role.id,
        active: true,
      },
      include: { role: true },
    });

    const payload = { email: user.email, sub: user.id, role: user.role.name };
    const { password, ...userWithoutPassword } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      // Don't leak existence in production, just return success
      return { message: 'If this email exists, a password reset link has been sent' };
    }
    // Simulate email dispatch
    return { message: 'If this email exists, a password reset link has been sent' };
  }
}
