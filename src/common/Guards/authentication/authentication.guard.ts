import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from 'src/common/Services/tokenService';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly TokenService: TokenService) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    let authorization: string = "";

    switch (context['contextType']) {
      case 'ws':
        authorization = context.switchToWs().getClient().handshake?.auth?.authorization ||
          context.switchToWs().getClient().handshake?.headers?.authorization;
        console.log({ client: authorization });
        context.switchToWs().getClient().user = await this.TokenService.verifyToken({ authorization });
        break;
      case 'http':
        authorization = context.switchToHttp().getRequest().headers.authorization;
        console.log(authorization);
        context.switchToHttp().getRequest().user = await this.TokenService.verifyToken({ authorization });
        break;
      default:
        break;
    }

    if (!authorization) {
      return false;
    }

    return true;
  }
}
