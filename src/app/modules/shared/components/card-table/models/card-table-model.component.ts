import { CardDataCardTableInterface } from './card-data-card-table.interface';
import { OrderByFilterCardTableInterface } from './order-by-filter-card-table.interface';

export abstract class CardTableModelComponent {
  orderByFilters: OrderByFilterCardTableInterface[];
  columns: CardDataCardTableInterface[];

  constructor(_columns: CardDataCardTableInterface[], _orderByFilters: OrderByFilterCardTableInterface[] = []) {
    this.columns = _columns;
    this.orderByFilters = _orderByFilters;
  }
  abstract clickRefresh(): void;
}
