import { Injectable } from '@nestjs/common';
import Service from '../dtos/jwt/jwt-service.dto';
import Routes from '../config/app.routes';

@Injectable()
export default class EndpointService {
  public all(): Service[] {
    return Object.keys(Routes).map((code) => {
      const method: any = code.substring(0, code.indexOf('_'));
      return {
        code,
        url: `${process.env.APP_ROUTE_PREFIX}/${Routes[code]}`,
        method,
      };
    });
  }
}
