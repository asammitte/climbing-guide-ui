export interface IBaseViewList<T> {
  items: Array<T>;
  pagination: IPagination;
}

export interface IPagination {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  itemsOnPage?: number;
  hasNext: boolean;
}
