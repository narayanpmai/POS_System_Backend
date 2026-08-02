import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantContext } from '../prisma/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // For authentication routes (login/register), run unconstrained so users across any tenant company can log in
    if (req.originalUrl?.includes('/auth/') || req.path?.includes('/auth/')) {
      return tenantContext.run({ isSuperAdmin: true, companyId: 0 }, () => {
        next();
      });
    }

    let companyId: number | undefined;
    let isSuperAdmin = false;

    // 1. Check x-company-id or x-tenant-id header (for company switcher / explicit headers)
    const headerCompanyId = req.headers['x-company-id'] || req.headers['x-tenant-id'];
    if (headerCompanyId) {
      const parsed = parseInt(Array.isArray(headerCompanyId) ? headerCompanyId[0] : headerCompanyId, 10);
      if (!isNaN(parsed)) {
        companyId = parsed;
      }
    }

    // 2. Extract JWT payload if cookie or authorization header is present
    const authHeader = req.headers.authorization;
    const cookieToken = (req as any).cookies?.access_token;
    const token = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.split(' ')[1] : cookieToken;

    if (token) {
      try {
        const payloadStr = Buffer.from(token.split('.')[1], 'base64').toString('utf8');
        const payload = JSON.parse(payloadStr);
        if (payload?.role === 'Super Admin') {
          isSuperAdmin = true;
        }
        if (!companyId && payload?.companyId) {
          companyId = Number(payload.companyId);
        }
      } catch (err) {
        // Ignore parsing errors
      }
    }

    // For Super Admin: if no explicit company header is set, set companyId to 0 for global system view
    const activeCompanyId = isSuperAdmin ? (headerCompanyId ? companyId : 0) : (companyId || 1);

    tenantContext.run({ companyId: activeCompanyId, isSuperAdmin }, () => {
      next();
    });
  }
}
