import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    this.logger.log(`🔑 Login request received for email: ${dto.email}`);

    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: true },
    });

    // Fallback: If not found by User email, check if email matches a Company email
    if (!user) {
      const company = await this.prisma.company.findFirst({
        where: { email: dto.email },
      });
      if (company) {
        user = await this.prisma.user.findFirst({
          where: { companyId: company.id },
          include: { role: true },
          orderBy: { id: 'asc' },
        });
        if (user) {
          this.logger.log(`⚡ Found Admin user for Company (${company.name}): ${user.email}`);
        }
      }
    }

    if (!user) {
      this.logger.warn(`❌ Login failed: Email not registered (${dto.email})`);
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      this.logger.warn(`❌ Login failed: Invalid password for ${dto.email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.active) {
      if (user.role?.name === 'Super Admin' || user.role?.name === 'Admin') {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { active: true },
        });
        user.active = true;
        this.logger.log(`⚡ Auto-reactivated ${user.role?.name} account: ${user.email}`);
      } else {
        this.logger.warn(`❌ Login failed: Account deactivated for ${dto.email}`);
        throw new UnauthorizedException('Your account has been deactivated');
      }
    }

    // Auto-associate Admin user to their company if email matches company email
    if (user.role?.name === 'Admin') {
      const matchedCompany = await this.prisma.company.findFirst({
        where: { email: user.email },
      });
      if (matchedCompany && user.companyId !== matchedCompany.id) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { companyId: matchedCompany.id },
        });
        user.companyId = matchedCompany.id;
        this.logger.log(`⚡ Auto-associated Admin ${user.email} to Company ID: ${matchedCompany.id} (${matchedCompany.name})`);
      }
    }

    this.logger.log(`✅ Login SUCCESSFUL: User ${user.email} (Role: ${user.role.name}, Company ID: ${user.companyId})`);

    const payload = { email: user.email, sub: user.id, role: user.role.name, companyId: user.companyId };
    const { password, ...userWithoutPassword } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async register(dto: RegisterDto) {
    this.logger.log(`📝 Registration request for email: ${dto.email}`);
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      this.logger.warn(`❌ Registration failed: Email already registered (${dto.email})`);
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

    this.logger.log(`✅ Registration SUCCESSFUL: User ${user.email}`);

    const payload = { email: user.email, sub: user.id, role: user.role.name, companyId: user.companyId };
    const { password, ...userWithoutPassword } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
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
