import * as Strategy from 'passport-cookie';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import GuardService from './guard.service';
import JwtPayload from 'src/dtos/jwt/jwt-payload.dto';

@Injectable()
export default class CookieStrategy extends PassportStrategy(Strategy, 'cookie') {
  constructor(private readonly guardService: GuardService) {
    super({
      cookieName: process.env.TOKEN_NAME,
    });
  }

  async validate(cookie: string, done: any): Promise<any> {
    const user: JwtPayload = await this.guardService.validateSession(cookie);

    if (!user) throw new UnauthorizedException(`Unauthorized Request.`);

    return done(null, user);
  }
}
