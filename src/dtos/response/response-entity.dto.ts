export interface ResponseStatus {
  code: number;
  description: string;
}

export interface Paging {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  totalPages: number;
}

export interface ResponseEntity<T> {
  status: ResponseStatus;
  data: T;
}

export class SingleResponse<T> implements ResponseEntity<T> {
  status: ResponseStatus;
  data: T;
}

export class PagedResponse<T> implements ResponseEntity<T> {
  status: ResponseStatus;
  data: T;
  paging: Paging;
}
