import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // Check role require for route
    if (!requiredRoles) return true;

    // Get user from request
    const request = context.switchToHttp().getRequest();

    // Get roles
    const roles = this.extractRolesFromHeader(request);

    // Return
    return requiredRoles.some((role) => roles?.includes(role));
  }

  // Get token from header
  private extractRolesFromHeader(request: any): string | undefined {
    // Get type and token from request headers
    const roles = request.headers?.roles?.split(' ') ?? [];

    // Return
    return roles;
  }
}
