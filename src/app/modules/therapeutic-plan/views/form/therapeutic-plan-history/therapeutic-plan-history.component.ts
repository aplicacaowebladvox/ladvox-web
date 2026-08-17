import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-therapeutic-plan-history',
  standalone: true,
  imports: [],
  templateUrl: './therapeutic-plan-history.component.html',
  styleUrl: './therapeutic-plan-history.component.scss',
})
export class TherapeuticPlanHistoryComponent {
  @Input()
  therapeuticPlanId!: number;
  @Input()
  editing!: boolean;
}
