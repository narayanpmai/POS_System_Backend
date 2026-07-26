import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'smartpos-ultra-secure-key-2026-antigravity',
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: true,
      },
    });

    if (!user || !user.active) {
      throw new UnauthorizedException('User is not authorized or active');
    }

    // --- Super Admin Global Company Filter ---
    // If the user is Super Admin, allow overriding their target companyId via header
    if (user.role && user.role.name === 'Super Admin') {
      const headerCompanyId = req.headers['x-company-id'];
      if (headerCompanyId) {
        const parsed = parseInt(headerCompanyId as string, 10);
        if (!isNaN(parsed) && parsed > 0) {
          user.companyId = parsed;
        }
      }
    }

    // Omit sensitive fields
    const { password, ...result } = user;
    return result;
  }
}
