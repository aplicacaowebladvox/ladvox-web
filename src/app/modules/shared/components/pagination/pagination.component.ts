import { Component, Input, OnInit, output } from '@angular/core';
import { BaseGridOptions } from '../card-table/models/base-grid-options.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnInit {
  @Input()
  totalRegisters!: number;
  @Input()
  gridOption!: BaseGridOptions;

  @Input()
  allowsPages: number[] = [10, 25, 50, 100];

  onPaginationChange = output<BaseGridOptions>();

  get currentPage(): number {
    return this.gridOption.page;
  }
  get pageSize(): number {
    return this.gridOption.pageSize;
  }

  pages: number = 0;

  get showGoToFirst(): boolean {
    return this.currentPage > 1 && this.pages > 1;
  }

  get showGoBackOne(): boolean {
    return this.currentPage - 1 > 1;
  }

  get showGoToLast(): boolean {
    return this.pages != this.currentPage;
  }

  get showGoNextOne(): boolean {
    return this.currentPage < this.pages;
  }

  get showEllipsis(): boolean {
    return this.currentPage + 2 < this.pages;
  }

  constructor() {}
  ngOnInit(): void {
    this._handlePagination();
  }

  clickPage(page: number): void {
    this.gridOption.page = page;
    this.changePagination(this.gridOption);
  }

  changePagination(_gridOption: BaseGridOptions) {
    this.onPaginationChange.emit(_gridOption);
  }
  private _handlePagination(): void {
    this.pages =
      this.totalRegisters / this.pageSize - Math.round(this.totalRegisters / this.pageSize) > 0
        ? Math.round(this.totalRegisters / this.pageSize) + 1
        : Math.round(this.totalRegisters / this.pageSize);
  }
}
