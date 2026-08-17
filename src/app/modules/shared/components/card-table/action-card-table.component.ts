import { Component, Input } from '@angular/core';
import { BaseCardTableActionConfig } from './config/base-card-table-action.config';

@Component({
  selector: 'app-action-card-table',
  standalone: true,
  template: '',
})
export class ActionCardTableComponent {
  @Input() config!: BaseCardTableActionConfig;
}
