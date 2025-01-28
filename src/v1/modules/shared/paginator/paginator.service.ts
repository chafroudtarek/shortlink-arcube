import { Injectable } from '@nestjs/common';
import { IPaginationQueryParams, IPaginationReturn, IPaginator } from './paginator.interface';

@Injectable()
export class Paginator implements IPaginator {
  async paginateQuery<Type>(
    count: number,
    data: Type,
    paginationQuery: IPaginationQueryParams,
  ): Promise<IPaginationReturn<Type>> {
    const skip = paginationQuery.skip;
    const limit = paginationQuery.limit;
    const totalItems = count;
    const currentPage = skip === 0 ? 1 : skip / limit + 1;
    const rowsPerPage = limit;
    const lastPage = Math.ceil(count / limit);
    const links: any = {};
    if (skip * limit < totalItems) {
      links.next = {
        page: currentPage + 1,
        limit: limit,
      };
    }
    if (currentPage > 1) {
      links.previous = {
        page: currentPage - 1,
        limit: limit,
      };
    }
    return {
      metadata: {
        total_items: totalItems,
        rows_per_page: rowsPerPage,
        current_page: currentPage,
        last_page: lastPage,
        ...links,
      },
      payload: data,
    };
  }
}
