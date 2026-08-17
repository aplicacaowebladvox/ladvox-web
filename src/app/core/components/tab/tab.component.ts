import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { ConvertUtils } from '../../../modules/shared/utils/convert.utils';
import { reduceString } from '../../../modules/shared/utils/string.util';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class TabComponent {
  @Input()
  items!: TabItem[];
  onTabChange = output<TabItem>();
  clickTab(item: TabItem): void {
    if (item.isDisabled) return;
    this.items.forEach((i) => (i.isActive = false));
    item.isActive = true;
    this.onTabChange.emit(item);
  }
  format(item: TabItem): string {
    if(!item.breakSize) return item.displayName;
    else return reduceString(item.displayName, item.breakSize)
  }
}

export interface TabItem {
  isDisabled: boolean;
  displayName: string;
  isActive?: boolean;
  titleSize: number | undefined;
  breakSize: number | undefined;
}
