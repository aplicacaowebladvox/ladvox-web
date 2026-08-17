import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  QueryList,
  inject,
  input,
} from '@angular/core';
import { OrderByFilterCardTableInterface } from './models/order-by-filter-card-table.interface';
import { CardTableModelComponent } from './models/card-table-model.component';
import { BaseCardTableConfig } from './config/base-card-table.config';
import { dateToString } from '../../utils/date.util';
import { ColumnCardTableConfig } from './config/column-card-table.config';
import { BaseFilterGridOptions } from './models/base-filter-grid-options.model';
import { BaseCardTableActionConfig } from './config/base-card-table-action.config';
import { ActionCardTableComponent } from './action-card-table.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PickCardTableActionModalComponent } from './pick-card-table-action-modal/pick-card-table-action-modal.component';

@Component({
  selector: 'app-card-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent, NgxSkeletonLoaderModule, MatDialogModule],
  templateUrl: './card-table.component.html',
  styleUrl: './card-table.component.scss',
})
export class CardTableComponent implements AfterContentInit {
  @Input()
  cardTableConfig!: BaseCardTableConfig;
  @ContentChildren(ActionCardTableComponent) actions?: QueryList<ActionCardTableComponent>;
  constructor(private dialog: MatDialog) {}

  get hasSomeData(): boolean {
    return (
      !this.cardTableConfig.isLoading &&
      !!this.cardTableConfig.registers &&
      this.cardTableConfig.registers.length > 0
    );
  }

  get dateOfFilter(): string {
    return dateToString(this.cardTableConfig.lastRefresh) || '';
  }

  get registers(): any[] {
    return this.cardTableConfig.registers;
  }

  get totalRegisters(): number {
    return this.cardTableConfig.totalRegisters;
  }

  private _columnCardTableConfig: ColumnCardTableConfig[] | null = null;
  get orderByFilters(): ColumnCardTableConfig[] {
    if (this._columnCardTableConfig == null) {
      this._columnCardTableConfig = this.cardTableConfig.columns.filter((c) => c.sortable) || [];
    }
    return this._columnCardTableConfig;
  }

  ngAfterContentInit(): void {}

  clickOrderByFilters(column: ColumnCardTableConfig): void {
    if (column.typeOrder == null) {
      column.typeOrder = 'asc';
      this._handleOrderByFiltersPriority(column);
    } else if (column.typeOrder == 'asc') column.typeOrder = 'desc';
    else if (column.typeOrder == 'desc') column.typeOrder = null;

    if (column.typeOrder == null) {
      this._handleOrderByFiltersPriority(column);
    }
  }

  clickCleanOrderByFilters(): void {
    this.cardTableConfig.columns.forEach((column) => {
      column.typeOrder = null;
      column.orderPriority = 0;
    });
    this.clickApplyOrderByFilters();
  }

  clickApplyOrderByFilters(): void {
    this.cardTableConfig.options.orderByFilters = this.cardTableConfig.columns
      .filter((column) => column.sortable)
      .map(
        (column) => new BaseFilterGridOptions(column.field, column.typeOrder, column.orderPriority)
      );
    this.cardTableConfig.refreshRegisters();
  }

  clickAction(action: BaseCardTableActionConfig, item: any) {
    action.click(item);
  }

  clickForActions(item: any): void {
    if (!this.actions || this.actions.length == 0) return;
    if (this.actions.length == 1) {
      this.actions.first.config.click(item);
    } else if (this.actions.filter((a) => a.config.isVisible(item)).length == 1) {
      this.actions.filter((a) => a.config.isVisible(item))[0].config.click(item);
    } else {
      let dialogRef = this.dialog.open(PickCardTableActionModalComponent, {
        width: '50mw',
        data: {
          actions: this.actions.filter((a) => a.config.isVisible(item)).map((a) => a.config),
          item: item,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          result.click(item);
        }
      });
    }
  }

  handleCellValue(column: ColumnCardTableConfig, item: any): string {
    if (column.convert) return column.convert(item[column.field]);
    if (column.convertByLine) return column.convertByLine(item);
    return item[column.field];
  }
  handleCellStyle(column: ColumnCardTableConfig, item: any): string {
    if (column.convertStyle) return column.convertStyle(item[column.field]);
    if (column.convertStyleByLine) return column.convertStyleByLine(item);
    return (column.styles || []).map((style) => style + ': ' + item['style'][style] + ';').join('');
  }

  onPaginationChange(option: any): void {
    console.log(option);
    this.cardTableConfig.refreshRegisters();
  }

  private _handleOrderByFiltersPriority(filter: ColumnCardTableConfig): void {
    if (filter.typeOrder == null) {
      this.cardTableConfig.columns.forEach((column) => {
        if (column.typeOrder != null) {
          column.orderPriority =
            column.orderPriority >= filter.orderPriority
              ? column.orderPriority - 1
              : column.orderPriority;
        }
      });
      filter.orderPriority = 0;
    } else {
      let lastValue = 0;
      this.cardTableConfig.columns.forEach((column) => {
        lastValue = column.orderPriority > lastValue ? column.orderPriority : lastValue;
      });
      filter.orderPriority = lastValue + 1;
    }
  }
}
