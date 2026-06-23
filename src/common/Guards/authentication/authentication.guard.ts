import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from 'src/common/Services/tokenService';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly TokenService: TokenService) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const { authorization } = context.switchToHttp().getRequest().headers;
    if (!authorization) {
      throw new UnauthorizedException('Missing token');
    }
    context.switchToHttp().getRequest().user =await this.TokenService.verifyToken({
      authorization: authorization,
    });


    

    return true;
  }
}
