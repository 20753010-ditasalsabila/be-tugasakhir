import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import TranslationService from '@services/common/translation.service';
import { ResponseStatus } from 'src/dtos/response/response-entity.dto';

@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly translationService: TranslationService) {}

  public catch(exception: any, host: ArgumentsHost) {
    const { error } = exception.getResponse();
    const response = host.switchToHttp().getResponse<Response>();
    let message = exception.getResponse();

    Logger.warn(
      `Exception occured ${exception.getStatus()} - ${error}`,
      HttpExceptionFilter.name,
      true,
    );
    if (
      typeof message === 'object' &&
      message !== null &&
      exception.getStatus() === HttpStatus.BAD_REQUEST
    ) {
      message = this.getValidationMessage(message);
    } else {
      message = message?.message || message?.error || error;
    }

    const status: ResponseStatus = {
      code: exception.getStatus(),
      description: message || this.translationService.translate(`http.${exception.getStatus()}`),
    };

    response.status(exception.getStatus()).json({ status });
  }
  private getValidationMessage(message: any): string {
    const { message: constraints, params } = message;

    if (Array.isArray(constraints)) {
      Logger.warn(
        `Handling ${constraints.length} validation message(s).`,
        HttpExceptionFilter.name,
      );
      const messages: string[] = this.parseValidationMessages(constraints);

      return this.translationService.translate(
        'validation.description',
        [messages.join(', ')],
        'validation.description',
      );
    }

    message = this.translationService.translate(constraints, params, constraints);

    return this.translationService.translate(
      'validation.description',
      [message],
      'validation.description',
    );
  }

  private parseValidationMessages(messages: any[]): string[] {
    return messages.map((message) => {
      let prefix = '';

      try {
        if (message.indexOf('.{') > -1) {
          const prefixes: string[] = message.substring(0, message.indexOf('.{')).split('.');

          if (Array.isArray(prefixes)) prefix = `${prefixes.join(' ')} `;

          message = message.replace(/^[^{]*/g, '');
        }
      } catch (error) {
        Logger.error(error.message, error.stack, HttpExceptionFilter.name, true);
      }

      try {
        const { code, params } = JSON.parse(message);

        return this.translationService.translate(
          code,
          params.map((x) => `${prefix}${x}`),
          code,
        );
      } catch (error) {
        return message;
      }
    });
  }
}
