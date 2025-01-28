export interface IPaginator {
  paginateQuery<Type>(
    count: number,
    data: Type,
    paginationQuery: IPaginationQueryParams,
  ): Promise<IPaginationReturn<Type>>;
}
export interface IPaginationQueryParams {
  skip: number;
  limit: number;
}
export interface IPaginationMetadata {
  total_items: number;
  rows_per_page: number;
  current_page: number;
  last_page: number;
  next: { page: number; limit: number };
  previous: { page: number; limit: number };
}
export interface IPaginationReturn<Type> {
  metadata: {
    total_items: number;
    rows_per_page: number;
    current_page: number;
    last_page: number;
    next: { page: number; limit: number };
    previous: { page: number; limit: number };
  };
  payload: Type;
}
export class PaginationMetadata {
  public total_items: number;
  public rows_per_page: number;
  public current_page: number;
  public last_page: number;
  public next: { page: number; limit: number };
  public previous: { page: number; limit: number };
}
export class PaginationReturn<T> implements IPaginationReturn<T> {
  public metadata: IPaginationMetadata;
  public payload: T;
}
