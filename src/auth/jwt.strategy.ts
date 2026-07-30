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

    // Check if x-company-id header is provided (for Super Admin company switching or explicit tenant header)
    const headerCompanyId = req.headers['x-company-id'] || req.headers['x-tenant-id'];
    let activeCompanyId = user.companyId;

    if (headerCompanyId) {
      const parsed = parseInt(Array.isArray(headerCompanyId) ? headerCompanyId[0] : headerCompanyId, 10);
      if (!isNaN(parsed) && parsed > 0) {
        if (user.role.name === 'Super Admin') {
          activeCompanyId = parsed;
        } else if (parsed === user.companyId) {
          activeCompanyId = parsed;
        }
      }
    }

    // Omit sensitive fields
    const { password, ...result } = user;
    return {
      ...result,
      companyId: activeCompanyId,
    };
  }
}
