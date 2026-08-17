import { BaseFilterGridOptions } from "./base-filter-grid-options.model";

export class BaseGridOptions {
  page: number = 1;
  pageSize: number = 10;
  orderByFilters: BaseFilterGridOptions[] = [];
}
