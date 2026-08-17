export class BaseFilterGridOptions {
  field!: string;
  typeOrder: 'asc' | 'desc' | null = null;
  orderPriority: number = 0;

  constructor(_field: string, _typeOrder: 'asc' | 'desc' | null, _orderPriority: number) {
    this.field = _field;
    this.typeOrder = _typeOrder;
    this.orderPriority = _orderPriority;
  }
}
