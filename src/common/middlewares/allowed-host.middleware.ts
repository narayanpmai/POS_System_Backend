import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AllowedHostMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host;
    // Allow localhost, 127.0.0.1, internal Docker IPs, and configured ALLOWED_HOSTS
    const allowedHostsStr = process.env.ALLOWED_HOSTS || 'localhost,127.0.0.1';
    const allowedHosts = allowedHostsStr.split(',').map(h => h.trim().toLowerCase());

    if (host) {
      const hostname = host.split(':')[0].toLowerCase();
      const isAllowed = allowedHosts.some(allowed => hostname === allowed || hostname.endsWith(`.${allowed}`));
      
      if (!isAllowed && process.env.NODE_ENV === 'production') {
        throw new BadRequestException(`Invalid HTTP Host Header: ${hostname}`);
      }
    }

    next();
  }
}
