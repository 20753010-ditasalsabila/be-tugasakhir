import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export default class RequestLanguage implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<CallHandler> {
    const requestContext = context.switchToHttp().getRequest();
    const headerLang: string = requestContext.header('lang');

    process.env.LANG = process.env.DEFAULT_LANG;

    if (headerLang) {
      process.env.LANG = headerLang.toLowerCase();
    }

    return next.handle();
  }
}
