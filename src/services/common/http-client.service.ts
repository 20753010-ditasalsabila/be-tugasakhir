import { getAxiosRequestConfig } from '@config/network.config';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import TokenUtil from '@util/common-util/token.util';
import { AxiosRequestConfig } from 'axios';
import { map, retry } from 'rxjs/operators';

import TranslationService from './translation.service';

@Injectable()
export default class HttpClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly translationService: TranslationService,
    private readonly tokenUtil: TokenUtil,
  ) {}

  protected async prepareRequest(
    sessionId: string,
    appKey?: string,
    params?: any,
  ): Promise<AxiosRequestConfig> {
    const config: AxiosRequestConfig = getAxiosRequestConfig();
    const token: string = await this.tokenUtil.generateInternalToken(sessionId);

    config.headers['Authorization'] = `Bearer ${token}`;

    if (params) {
      config.params = params;
    }

    if (appKey) {
      config.headers['app-key'] = appKey;
    }
    return config;
  }

  public async getAccountStaff(id: string, sessionId: string): Promise<any> {
    const url = `${process.env.MS_AUTH}/staffs/${id}`;
    const config: AxiosRequestConfig = await this.prepareRequest(sessionId, process.env.APP_KEY);

    try {
      Logger.log(`Get Account Staff with ID ${id}`, HttpClientService.name, true);
      return await this.httpService
        .get(url, config)
        .pipe(
          retry(3),
          map((response) => response.data),
          
        )
        .toPromise();
    } catch (error) {
      Logger.error(error.response.statusText, error.stack, HttpClientService.name, true);
      if (error.response.status === 500)
        throw new NotFoundException(
          this.translationService.translate('generic.resource.notFound', ['Staff', `ID ${id}`]),
        );
    }
  }
}
