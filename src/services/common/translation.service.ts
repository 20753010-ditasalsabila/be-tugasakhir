import messages from '@config/message';
import { Injectable } from '@nestjs/common';
import { Store } from 'confidence';
import { replaceAll, sprintf } from 'voca';

@Injectable()
export default class TranslationService {
  private readonly store: Store;

  constructor() {
    this.store = new Store(messages);
  }

  public translate(code: string, params?: any[], defaultValue?: string): string {
    const { LANG: lang, DEFAULT_LANG: defaultLang } = process.env;
    code = replaceAll(replaceAll(code, /\s/g, ''), /\./, '/');
    code = `/${lang || defaultLang}/${code}`;
    let message: string = this.store.get(code);

    if (message && params) {
      message = sprintf(message, ...params);
    } else if (defaultValue && params) {
      message = sprintf(defaultValue, ...params);
    }

    return message || defaultValue;
  }
}
