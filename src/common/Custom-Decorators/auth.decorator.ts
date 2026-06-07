
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../Guards/authentication/authentication.guard';
import { AuthorizationGuard } from '../Guards/authorization/authorization.guard';
import { RoleTypes } from 'src/Database/Models/user.model';

export function Auth(roles: RoleTypes[]) {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthenticationGuard, AuthorizationGuard),
    );
}
