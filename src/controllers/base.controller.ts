import {
  PagedResponse,
  Paging,
  ResponseEntity,
  ResponseStatus,
  SingleResponse,
} from 'src/dtos/response/response-entity.dto';

export default class BaseController<T> {
  protected sendResponse(data: T, status?: ResponseStatus): ResponseEntity<T> {
    const response: SingleResponse<T> = new SingleResponse();

    response.data = data;
    if (status) {
      response.status = status;
    }

    return response;
  }

  protected sendPagedResponse(
    data: T[],
    paging: Paging,
    status?: ResponseStatus,
  ): ResponseEntity<T[]> {
    const response: PagedResponse<T[]> = new PagedResponse();

    response.data = data;
    response.paging = paging;
    if (status) {
      response.status = status;
    }

    return response;
  }
}
