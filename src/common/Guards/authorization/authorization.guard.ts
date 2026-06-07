import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleTypes } from 'src/Database/Models/user.model';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    let role: RoleTypes = context.switchToHttp().getRequest().user.role;
    const requiredRoles = this.reflector
      .getAllAndOverride<RoleTypes[]>('roles', [context.getHandler(), context.getClass()]);
     

    if (!requiredRoles?.includes(role)) {
      throw new ForbiddenException('unauthorized account!!');
    }

    return true;
  }
}
