import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantContext } from '../prisma/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let companyId: number | undefined;
    let isSuperAdmin = false;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payloadStr = Buffer.from(token.split('.')[1], 'base64').toString();
        const payload = JSON.parse(payloadStr);
        if (payload && payload.companyId) {
          companyId = payload.companyId;
        }
        if (payload && (payload.role === 'Super Admin' || payload.roleName === 'Super Admin')) {
          isSuperAdmin = true;
        }
      } catch (err) {
        // Ignore parsing errors, companyId remains undefined
      }
    }

    if (companyId) {
      tenantContext.run({ companyId, isSuperAdmin }, () => {
        next();
      });
    } else {
      next();
    }
  }
}
