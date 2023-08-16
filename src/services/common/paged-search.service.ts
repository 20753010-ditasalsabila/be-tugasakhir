import { Injectable } from '@nestjs/common';
import { QueryParams } from 'src/dtos/params/query-params.dto';

@Injectable()
export default class PagedSearchService {
  protected extraQueryParams(params: QueryParams): {
    term: string;
    page: number;
    order: { [key: string]: any };
    take: number;
    skip: number;
    withDeleted: boolean;
  } {
    const { term = '', page: currentPage, rows, order: field, sort, deleted } = params;
    const order = field && sort ? { [field]: sort } : undefined;
    const page: number = currentPage || 1;
    const take: number = rows || +process.env.DEFAULT_ROWS_PER_PAGE;
    const skip: number = +page > 1 ? (+page - 1) * take : 0;
    const withDeleted: boolean = deleted === '1';

    return { term, page, order, take, skip, withDeleted };
  }
}
