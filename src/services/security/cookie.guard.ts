import { getClientIp } from 'request-ip';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ALLOWED_ROLE } from '@util/decorator/role.decorator';
import { Observable } from 'rxjs';
import GuardService from './guard.service';
import { ALLOW_INTRANET } from '@util/decorator/internal.decorator';

@Injectable()
export default class CookieGuard extends AuthGuard('cookie') {
  constructor(private readonly guardService: GuardService, private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const cookie: string = context.switchToHttp().getRequest().cookies[process.env.TOKEN_NAME];
    const method: string = context.switchToHttp().getRequest().method;
    const url: string = context.switchToHttp().getRequest().route.path;

    return Promise.all([
      super.canActivate(context),
      this.validateSession(cookie, url, method),
    ]).then(([canActivate, validSession]) => {
      return canActivate && validSession;
    }); // this.validateSession(cookie, url, method);
  }

  private async validateSession(token: string, url: string, method: string): Promise<boolean> {
    return this.guardService.validateAccess(token, url, method);
  }

  private async validateIntranetAccess(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: string = request.headers['authorization']?.replace('Bearer', '').trim();
    const originIP: string = getClientIp(request);
    const allowIntranet: boolean =
      this.reflector.getAllAndOverride(ALLOW_INTRANET, [
        context.getHandler(),
        context.getClass(),
      ]) || false;

    if (allowIntranet && token) {
      return await this.guardService.validateInternalToken(token, originIP);
    } else {
      return null;
    }
  }

  private roleAccess(context: ExecutionContext): string[] {
    return (
      this.reflector.getAllAndOverride(ALLOWED_ROLE, [context.getHandler(), context.getClass()]) ||
      []
    );
  }
}
