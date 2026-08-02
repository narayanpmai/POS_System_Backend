import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto, clientIp?: string, userAgent?: string) {
    const cleanEmail = dto.email?.trim().toLowerCase();
    this.logger.log(`🔑 Login request received for email: ${cleanEmail}`);

    let user = await this.prisma.user.findFirst({
      where: { email: { equals: cleanEmail, mode: 'insensitive' } },
      include: { role: true },
    });

    // Fallback: Check if email matches Company email
    if (!user) {
      const company = await this.prisma.company.findFirst({
        where: { email: { equals: cleanEmail, mode: 'insensitive' } },
      });
      if (company) {
        user = await this.prisma.user.findFirst({
          where: { companyId: company.id },
          include: { role: true },
          orderBy: { id: 'asc' },
        });
      }
    }

    if (!user) {
      this.logger.warn(`❌ Login failed: Email not registered (${cleanEmail})`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Brute Force Lockout check
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMins = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / (60 * 1000));
      this.logger.warn(`❌ Account locked for user: ${cleanEmail} until ${user.lockoutUntil}`);
      throw new UnauthorizedException(`Account locked due to 5 failed attempts. Please try again in ${remainingMins} minutes.`);
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
      let lockoutUntil: Date | null = null;
      if (newFailedAttempts >= 5) {
        lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minute lock
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newFailedAttempts,
          lockoutUntil,
        },
      });

      if (newFailedAttempts >= 5) {
        this.logger.warn(`⛔ Account locked for 15 mins for ${cleanEmail} after 5 failed attempts`);
        throw new UnauthorizedException('Account locked for 15 minutes due to 5 consecutive failed login attempts.');
      }

      this.logger.warn(`❌ Login failed: Invalid password for ${dto.email} (Attempt ${newFailedAttempts}/5)`);
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.active) {
      if (user.role?.name === 'Super Admin' || user.role?.name === 'Admin') {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { active: true },
        });
        user.active = true;
      } else {
        throw new UnauthorizedException('Your account has been deactivated');
      }
    }

    // Reset failed attempts on success
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
      },
    });

    const payload = { email: user.email, sub: user.id, role: user.role.name, companyId: user.companyId };
    const accessToken = this.jwtService.sign(payload);

    // Create UserSession
    const refreshToken = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        companyId: user.companyId,
        refreshToken,
        ipAddress: clientIp || '127.0.0.1',
        userAgent: userAgent || 'Unknown Device',
        expiresAt,
      },
    });

    const { password, ...userWithoutPassword } = user;

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: userWithoutPassword,
    };
  }

  async register(dto: RegisterDto) {
    this.logger.log(`📝 Registration request for email: ${dto.email}`);
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new BadRequestException('Email already registered');
    }

    let role = await this.prisma.role.findFirst({
      where: { name: dto.role || 'Cashier' },
    });

    if (!role) {
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

    const payload = { email: user.email, sub: user.id, role: user.role.name, companyId: user.companyId };
    const { password, ...userWithoutPassword } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async logout(userId: number, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.userSession.deleteMany({
        where: { userId, refreshToken },
      });
    } else {
      await this.prisma.userSession.deleteMany({
        where: { userId },
      });
    }
    return { message: 'Logged out successfully, session cleared' };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken || typeof refreshToken !== 'string' || !refreshToken.trim()) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const session = await this.prisma.userSession.findFirst({
      where: { refreshToken },
      include: { user: { include: { role: true } } },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await this.prisma.userSession.delete({ where: { id: session.id } });
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = session.user;
    const payload = { email: user.email, sub: user.id, role: user.role.name, companyId: user.companyId };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = randomUUID();

    // Rotate refresh token
    await this.prisma.userSession.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  async forgotPassword(email: string) {
    this.logger.log(`📧 Forgot password request for email: ${email}`);
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return { message: 'If this email exists, a password reset link has been sent' };
    }
    return { message: 'If this email exists, a password reset link has been sent' };
  }
}
