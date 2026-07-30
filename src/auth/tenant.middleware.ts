import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantContext } from '../prisma/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let companyId: number | undefined;

    // 1. Prioritize x-company-id or x-tenant-id header (for company switcher / explicit headers)
    const headerCompanyId = req.headers['x-company-id'] || req.headers['x-tenant-id'];
    if (headerCompanyId) {
      const parsed = parseInt(Array.isArray(headerCompanyId) ? headerCompanyId[0] : headerCompanyId, 10);
      if (!isNaN(parsed) && parsed > 0) {
        companyId = parsed;
      }
    }

    // 2. Fallback to JWT Authorization token if companyId not found in header
    if (!companyId) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const payloadStr = Buffer.from(token.split('.')[1], 'base64').toString('utf8');
          const payload = JSON.parse(payloadStr);
          if (payload && payload.companyId) {
            companyId = Number(payload.companyId);
          }
        } catch (err) {
          // Ignore parsing errors
        }
      }
    }

    // 3. Fallback default companyId (default 1)
    if (!companyId) {
      companyId = 1;
    }

    // Run tenantContext AsyncLocalStorage for all downstream Prisma queries
    tenantContext.run({ companyId }, () => {
      next();
    });
  }
}
