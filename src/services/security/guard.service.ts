import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import JwtPayload from '../../dtos/jwt/jwt-payload.dto';
import RedisStoreService from '../utility/redis-store.service';
import User from '../../dtos/jwt/jwt-user.dto';
import { getAllowedIPs } from '@config/network.config';
import TokenUtil from '@util/common-util/token.util';

@Injectable()
export default class GuardService {
  constructor(
    private readonly redisService: RedisStoreService,
    private readonly tokenUtil: TokenUtil,
  ) {}

  public sign(): string {
    const {
      TOKEN_KEY_PATH,
      TOKEN_ALGORITHM,
      TOKEN_EXPIRATION: expires,
      TOKEN_SECRET: passphrase,
    } = process.env;
    const key: Buffer = readFileSync(resolve(TOKEN_KEY_PATH));
    const algorithm: any = TOKEN_ALGORITHM;

    return jwtSign({ aid: 'aid' }, { key, passphrase }, { expiresIn: +expires, algorithm });
  }

  public async verify(sessionId: string): Promise<JwtPayload> {
    const { TOKEN_PUB_PATH, TOKEN_ALGORITHM } = process.env;
    const publicKey: Buffer = readFileSync(resolve(TOKEN_PUB_PATH));
    const algorithms: any = TOKEN_ALGORITHM;
    const token: string = await this.redisService.get(sessionId);

    try {
      return jwtVerify(token, publicKey, { algorithms }) as JwtPayload;
    } catch (error) {
      Logger.warn(
        `JWT verification failed with message: ${error.message}.`,
        'GuardService@verify',
        true,
      );
      throw new UnauthorizedException('Unauthorized Request.');
    }
  }

  public async validateAccess(token: string, url: string, method: string): Promise<boolean> {
    const { services }: JwtPayload = await this.verify(token);

    return services.some(
      (service) =>
        service.url.replace(`${process.env.APP_ROUTE_PREFIX}`, '') === url &&
        service.method === method,
    );
  }

  public async validateSession(token: string): Promise<JwtPayload> {
    return await this.verify(token);
  }

  public async validateInternalToken(token: string, originIP: string): Promise<boolean> {
    const allowedIPs: string[] = getAllowedIPs();
    const validToken: string = await this.tokenUtil.validateInternalToken(token);
    return allowedIPs.includes(originIP) && validToken !== undefined;
  }
}
