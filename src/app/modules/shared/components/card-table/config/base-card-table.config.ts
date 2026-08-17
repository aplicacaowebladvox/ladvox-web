import { BaseGridOptions } from '../models/base-grid-options.model';
import { BaseCardTableActionConfig } from './base-card-table-action.config';
import { ColumnCardTableConfig } from './column-card-table.config';

export abstract class BaseCardTableConfig {
  options!: BaseGridOptions;
  columns!: ColumnCardTableConfig[];

  showActionsAsModalForSelect: boolean = false
  actions?: BaseCardTableActionConfig[];
  registers: any[] = [];
  totalRegisters: number = 0;

  lastRefresh?: Date;

  isLoading: boolean = false;
  constructor() {
    this.options = new BaseGridOptions();
  }

  clear(): void {
    this.registers = [];
    this.totalRegisters = 0;
  }

  reset(keepPage: boolean = false): void {
    if (!keepPage) this.options.page = 1;

    this.options.orderByFilters = [];
  }

  public abstract refreshRegisters(): void;
}
