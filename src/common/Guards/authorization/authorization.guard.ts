import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleTypes, UserDocument } from 'src/Database/Models/user.model';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    let user: UserDocument | undefined;
    const requiredRoles = this.reflector
      .getAllAndOverride<RoleTypes[]>('roles', [context.getHandler(), context.getClass()]);

    switch (context['contextType']) {
      case 'ws':
        user = context.switchToWs().getClient().user;
        break;
      case 'http':
        user = context.switchToHttp().getRequest().user;
        break;
      default:
        break;
    }

    if (!user || !requiredRoles?.includes(user.role)) {
      return false;
    }

    return true;
  }
}
