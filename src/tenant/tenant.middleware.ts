import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantContext } from './tenant.context';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const tenantIdHeader = req.headers['x-tenant-id'];
    const tenantDomainHeader = req.headers['x-tenant-domain'];
    const originHeader = req.headers.origin as string;
    const refererHeader = req.headers.referer as string;

    // Resolve domain/host to parse the tenant
    let rawHost = (tenantDomainHeader as string) || req.headers.host || '';

    // If host is the API gateway domain, fall back to Origin or Referer (which represent the frontend URL)
    const apiDomains = ['koseligharapi.deeyosoft.com', 'localhost:5000', '127.0.0.1:5000'];
    const isApiHost = apiDomains.some(apiDom => rawHost.includes(apiDom));

    if (isApiHost || !rawHost) {
      const sourceUrl = originHeader || refererHeader || '';
      if (sourceUrl) {
        try {
          const parsedUrl = new URL(sourceUrl);
          rawHost = parsedUrl.host;
        } catch (e) {
          // ignore parsing error
        }
      }
    }

    const host = rawHost.split(':')[0]; // strip port

    console.log('[TenantMiddleware] rawHost:', rawHost, '| host:', host, '| tenantDomainHeader:', tenantDomainHeader);

    let tenantId: number | null = null;

    if (tenantIdHeader) {
      tenantId = parseInt(tenantIdHeader as string, 10);
    } else {
      const parts = host.split('.');
      const subdomain = parts.length > 1 ? parts[0] : null;
      console.log('[TenantMiddleware] subdomain:', subdomain);
      if (subdomain && subdomain !== 'www' && subdomain !== 'localhost' && subdomain !== 'api') {
        const tenant = await prisma.tenant.findFirst({
          where: {
            OR: [
              { subdomain },
              { customDomain: host }
            ]
          }
        });
        console.log('[TenantMiddleware] tenant found:', tenant?.id, tenant?.subdomain);
        if (tenant) {
          tenantId = tenant.id;
        }
      }
    }

    if (tenantId) {
      tenantContext.run({ tenantId }, () => {
        next();
      });
    } else {
      // If no tenant is resolved, you could either throw an error or just let it pass without tenant scope
      // Usually, some routes (like global admin) don't need tenant scope.
      next();
    }
  }
}
