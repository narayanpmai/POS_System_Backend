import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new ForbiddenException('User context or role missing');
    }

    const userRoleName = typeof user.role === 'string' ? user.role : user.role?.name;
    const hasRole = requiredRoles.includes(userRoleName);

    if (!hasRole) {
      throw new ForbiddenException(`Access denied. Role '${userRoleName}' does not hold permission to access this resource.`);
    }

    return true;
  }
}
