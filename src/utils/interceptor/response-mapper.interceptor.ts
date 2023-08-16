import { CallHandler, ExecutionContext, Inject, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import TranslationService from '@services/common/translation.service';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseEntity, ResponseStatus } from 'src/dtos/response/response-entity.dto';

@Injectable()
export default class ResponseMapper<T> implements NestInterceptor<T, ResponseEntity<T>> {
  constructor(
    @Inject(TranslationService)
    private readonly translationService: TranslationService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseEntity<T>> | Promise<Observable<ResponseEntity<T>>> {
    const { statusCode } = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        return this.rebuild(statusCode, data);
      }),
    );
  }

  private rebuild(code: number, response) {
    if (!response) return;
    const { status: customStatus, ...data } = response;
    const status: ResponseStatus = {
      code,
      description: this.translationService.translate(`http.${code}`),
    };

    if (customStatus) {
      status.code = customStatus.code;
      status.description = this.translationService.translate(
        customStatus.description,
        undefined,
        customStatus.description,
      );
    }

    return {
      status,
      ...data,
    };
  }
}
