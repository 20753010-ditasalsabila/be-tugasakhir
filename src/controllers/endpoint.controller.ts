import { Controller, Get, UseInterceptors } from '@nestjs/common';
import Routes from '../config/app.routes';
import EndpointService from '../services/endpoint.service';
import Service from '../dtos/jwt/jwt-service.dto';
import ResponseMapper from '@util/interceptor/response-mapper.interceptor';
import { ResponseEntity } from 'src/dtos/response/response-entity.dto';
import BaseController from './base.controller';

@Controller()
@UseInterceptors(ResponseMapper)
export default class EndpointController extends BaseController<any> {
  constructor(private readonly endpointService: EndpointService) {
    super();
  }

  @Get(Routes.GET_ENDPOINTS)
  public all(): ResponseEntity<Service[]> {
    const result: Service[] = this.endpointService.all();
    return this.sendResponse(result);
  }
}
